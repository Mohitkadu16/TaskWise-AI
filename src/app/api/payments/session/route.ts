import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const plan: 'monthly' | 'yearly' = body.plan;
    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan. Must be monthly or yearly' }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const supabase = await createClient();

    // Amount in minor units (paise for INR)
    const amount_minor = plan === 'monthly' ? 20000 : 200000; // ₹200 or ₹2000
    const currency = 'INR';

    // Insert a pending payment record in Supabase
    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert([
        {
          user_id: user.id,
          plan,
          amount_minor,
          currency,
          status: 'pending',
          description: plan === 'monthly' ? 'Pro Plan - Monthly (₹200)' : 'Pro Plan - Yearly (₹2000)',
          amount: null,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create payment record:', insertError.message);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    console.log('Payment created:', payment);

    // Payment provider integration point
    const provider = process.env.PAYMENT_PROVIDER || '';
    
    if (provider === 'stripe') {
      // Stripe integration
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Stripe = require('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2022-11-15' });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: plan === 'monthly' ? 'TaskWise Pro - Monthly' : 'TaskWise Pro - Yearly',
                  description: plan === 'monthly' ? '₹200/month' : '₹2000/year',
                },
                unit_amount: amount_minor, // in paise
              },
              quantity: 1,
            },
          ],
          success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/dashboard?payment_status=success&payment_id=${payment.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/payments?payment_status=canceled`,
          metadata: { payment_id: payment.id, user_id: user.id, plan },
        });

        console.log('Stripe session created:', session.id);
        return NextResponse.json({ url: session.url });
      } catch (e: any) {
        console.error('Stripe session creation error:', e?.message || e);
        return NextResponse.json({ error: 'Stripe not configured or failed to create session' }, { status: 500 });
      }
    }

    if (provider === 'razorpay') {
      // Razorpay integration
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Razorpay = require('razorpay');
        const razor = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await razor.orders.create({
          amount: amount_minor, // in paise
          currency: 'INR',
          receipt: `payment_${payment.id}`,
          notes: {
            payment_id: payment.id,
            user_id: user.id,
            plan,
          },
        });

        // Update payment with Razorpay order ID
        await supabase
          .from('payments')
          .update({
            provider: 'razorpay',
            provider_session_id: order.id,
          })
          .eq('id', payment.id);

        console.log('Razorpay order created:', order.id);
        
        // Return order details for client-side checkout
        return NextResponse.json({
          orderId: order.id,
          key: process.env.RAZORPAY_KEY_ID,
          amount: amount_minor,
          currency: 'INR',
          userEmail: user.email,
          userName: user.user_metadata?.full_name || 'User',
        });
      } catch (e: any) {
        console.error('Razorpay error:', e?.message || e);
        return NextResponse.json({ error: 'Razorpay not configured or failed' }, { status: 500 });
      }
    }

    if (provider === 'uropay') {
      // Minimal UROPay integration example.
      // NOTE: Replace request fields and endpoint with the exact API described in https://www.uropay.me/documentation
      try {
        const UROPAY_API_BASE = process.env.UROPAY_API_BASE || 'https://api.uropay.me';
        const UROPAY_API_KEY = process.env.UROPAY_API_KEY;
        if (!UROPAY_API_KEY) {
          throw new Error('UROPay not configured (missing UROPAY_API_KEY)');
        }

        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/api/payments/uropay-return`;

        const createRes = await fetch(`${UROPAY_API_BASE}/v1/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${UROPAY_API_KEY}`,
          },
          body: JSON.stringify({
            amount: amount_minor,
            currency,
            callback_url: callbackUrl,
            metadata: { payment_id: payment.id, user_id: user.id, plan },
          }),
        });

        if (!createRes.ok) {
          const text = await createRes.text();
          console.error('UROPay create failed:', createRes.status, text);
          return NextResponse.json({ error: 'UROPay create failed' }, { status: 500 });
        }

        const payload = await createRes.json();

        // Persist provider id if present (adapt field names as needed)
        await supabase
          .from('payments')
          .update({ provider: 'uropay', provider_session_id: payload.id || payload.payment_id })
          .eq('id', payment.id);

        // Expecting a hosted checkout URL in the response; adapt field name if different
        const checkoutUrl = payload.checkout_url || payload.url || payload.redirect_url;
        return NextResponse.json({ checkoutUrl });
      } catch (e: any) {
        console.error('UROPay error:', e?.message || e);
        return NextResponse.json({ error: 'UROPay not configured or failed' }, { status: 500 });
      }
    }

    // No provider configured — return success with payment ID and note that manual setup is needed
    console.log('Payment created but no provider configured. Provider env var not set.');
    return NextResponse.json({
      message: 'Payment record created. Provider not configured.',
      paymentId: payment.id,
      status: 'pending',
    });
  } catch (err: any) {
    console.error('API /api/payments/session error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
