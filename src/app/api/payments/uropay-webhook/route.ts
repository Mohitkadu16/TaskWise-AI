import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Webhook receiver for UROPay. Adjust signature header name and algorithm to match UROPay docs.
export async function POST(req: Request) {
  try {
    const raw = await req.text();
    const sigHeader = req.headers.get('x-uropay-signature') || req.headers.get('x-signature') || '';
    const secret = process.env.UROPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.warn('UROPay webhook received but no UROPAY_WEBHOOK_SECRET configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });
    }

    // Verify HMAC SHA256 signature. Replace method if UROPay uses a different scheme.
    // NOTE: This code runs in Node.js environment (Next server). Using dynamic import to avoid ESM issues.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = await import('crypto');
    const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
    if (!sigHeader || sigHeader !== expected) {
      console.warn('Invalid UROPay webhook signature', { sigHeader, expected });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(raw);
    const supabase = await createClient();

    // Attempt to find the payment id in metadata or payload; adapt to UROPay payload shape
    const paymentId = payload?.metadata?.payment_id || payload?.data?.metadata?.payment_id || payload?.payment_id || null;
    if (!paymentId) {
      console.warn('UROPay webhook missing payment id in payload', payload);
      return NextResponse.json({ ok: true });
    }

    // Mark payment completed and save provider payload for audit
    await supabase
      .from('payments')
      .update({ status: 'completed', metadata: payload, amount: payload.amount ? payload.amount / 100 : null })
      .eq('id', paymentId);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('UROPay webhook handler error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'failed' }, { status: 500 });
  }
}
