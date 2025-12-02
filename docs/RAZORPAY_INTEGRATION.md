# Razorpay Integration Guide for TaskWise-AI

This guide walks through adding Razorpay payments to your Next.js + Supabase project. It covers:

- Account and API key setup in Razorpay
- Installing required npm package
- Setting environment variables
- Server-side integration (creating orders)
- Client-side checkout using Razorpay Checkout
- Webhook endpoint to verify payment signature and mark `payments` row completed in Supabase
- Notes on testing and security

---

## 1) Create Razorpay account & get API keys

1. Go to https://dashboard.razorpay.com/ and sign up (or log in).
2. In the dashboard, go to `Settings` → `API Keys` → `Generate Key` (for test keys use Test mode).
3. Copy `Key ID` and `Key Secret`. Keep these secret — don’t commit to git.

Set following env variables in your development `.env.local` (server-only):

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
PAYMENT_PROVIDER=razorpay
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

---

## 2) Install Razorpay sdk

In the project root:

```bash
npm install razorpay
```

---

## 3) Server: Create order (already partially implemented)

We added server route `src/app/api/payments/session/route.ts` which will:

- Insert a `payments` row with `status = 'pending'`
- Create a Razorpay order using `razorpay.orders.create(...)`
- Update the `payments` row with `provider = 'razorpay'` and `provider_session_id = order.id`
- Return `orderId` and `key` for the client

That route requires you have `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` set.

If you prefer the endpoint under `/api/razorpay/create-order`, you can copy logic from `session/route.ts`.

---

## 4) Client: Razorpay Checkout

Add this client-only helper or call from your payments page after creating the order.

Example client code (simplified):

```ts
function launchRazorpayCheckout({ orderId, key, amount, userEmail, userName }) {
  const options = {
    key, // Razorpay Key ID
    amount, // in paise
    currency: 'INR',
    name: 'TaskWise AI',
    description: 'Pro plan purchase',
    order_id: orderId,
    handler: async function (response) {
      // response.razorpay_payment_id
      // response.razorpay_order_id
      // response.razorpay_signature
      // Send these to your webhook verification or server to verify & update DB
      await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
        }),
      });
    },
    prefill: {
      name: userName,
      email: userEmail,
    },
    theme: {
      color: '#3399cc'
    }
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
```

**Note:** You must include the Razorpay checkout script in the client. Add to `app/layout.tsx` or load dynamically:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

## 5) Server: Webhook to verify signature and update payment

Razorpay sends webhooks to your server when payment succeeds. Implement `/api/payments/razorpay-webhook/route.ts`.

Steps server-side:

1. Validate signature using the `crypto` HMAC algorithm and your `RAZORPAY_KEY_SECRET`.
2. If valid and `payload.event === 'payment.captured' || payload.event === 'order.paid'`, update the corresponding `payments` row:
   - Set `status = 'completed'`
   - Save provider metadata (full webhook payload) into `metadata` column

Example logic (pseudo):

```ts
const body = await req.text();
const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
const headerSignature = req.headers.get('x-razorpay-signature');
if (expectedSignature !== headerSignature) return Response(400);
// parse body and update DB
```

**Important:** Razorpay webhooks must be verified. Use the `x-razorpay-signature` header.

---

## 6) Test flow

1. Start dev server with `.env.local` set and `PAYMENT_PROVIDER=razorpay`
2. Open Payments page, click Subscribe.
3. Server will create a payment record and a Razorpay order.
4. Client receives orderId & opens checkout (you must open with the JS SDK). Use test card or UPI flows.
5. On success, Razorpay will call your webhook; verify signature and update DB.

---

## 7) Checklist & security

- [ ] Do not commit keys to git
- [ ] Use HTTPS when deployed
- [ ] Configure webhook secret and URL in Razorpay Dashboard
- [ ] Use server-side verification for webhooks only (not client-side)

---

If you want, I can now:

- Add the client-side `launchRazorpayCheckout` logic to `payments/page.tsx` and load the checkout script dynamically
- Add a new API route `src/app/api/payments/verify/route.ts` that accepts the Razorpay handler post from the client and verifies signature server-side (helpful if you prefer synchronous verification)
- Add the webhook route `/api/payments/razorpay-webhook/route.ts` (recommended)

Which do you want me to implement next? If you want webhook and client checkout, I can implement both and show you how to configure the Razorpay dashboard for test webhooks.