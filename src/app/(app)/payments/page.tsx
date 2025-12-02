"use client";

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

const proFeatures = [
    "Unlimited tasks",
    "Advanced AI evaluations",
    "Team collaboration features",
    "Priority support",
    "Export data options",
];

export default function PaymentsPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: 'monthly' | 'yearly') => {
    try {
      setLoadingPlan(plan);
      const res = await fetch('/api/payments/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create session');

      // Stripe returns url, UROPay returns checkoutUrl, Razorpay returns order details
      if (data?.url) {
        // stripe redirect
        window.location.href = data.url;
      } else if (data?.checkoutUrl) {
        // UROPay hosted checkout
        window.location.href = data.checkoutUrl;
      } else if (data?.orderId && data?.key) {
        // Razorpay-style response — open widget if script is present
        if ((window as any).Razorpay) {
          const options = {
            key: data.key,
            amount: data.amount,
            currency: data.currency,
            name: 'TaskWise AI',
            order_id: data.orderId,
            handler: async function (response: any) {
              // You should verify/update the payment server-side via webhook or verification endpoint
              await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
              });
            },
            prefill: {
              name: data.userName || '',
              email: data.userEmail || '',
            },
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          alert('Razorpay checkout not available (checkout script missing)');
        }
      } else {
        alert('Payment provider not configured. See server logs for details.');
      }
    } catch (err: any) {
      alert(err.message || 'Payment initialization failed');
    } finally {
      setLoadingPlan(null);
    }
  };
  return (
    <div className="container mx-auto max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Billing & Plans</CardTitle>
          <CardDescription>
            Manage your subscription and billing details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Your Current Plan</h3>
            <p className="text-4xl font-bold mt-2">Free Plan</p>
            <p className="text-muted-foreground mt-1">
              Includes basic task management and limited AI evaluations.
            </p>
          </div>
          <div className="rounded-lg border bg-primary/10 p-6">
            <h3 className="text-lg font-semibold text-primary">Upgrade to Pro</h3>
            <p className="text-muted-foreground mt-1">
              Unlock powerful features to boost your productivity.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Monthly</div>
                <div className="text-2xl font-bold">₹200</div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Yearly</div>
                <div className="text-2xl font-bold">₹2000</div>
                <div className="text-xs text-muted-foreground">per year</div>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
                {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500"/>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 flex-col sm:flex-row">
          <Button className="w-full sm:w-auto" size="lg" onClick={() => handleCheckout('monthly')} disabled={loadingPlan !== null}>
            {loadingPlan === 'monthly' ? 'Redirecting...' : 'Subscribe ₹200 / month'}
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" size="lg" onClick={() => handleCheckout('yearly')} disabled={loadingPlan !== null}>
            {loadingPlan === 'yearly' ? 'Redirecting...' : 'Pay ₹2000 / year'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
