````markdown
# UROPay Integration Guide for TaskWise-AI

This guide shows a minimal, secure way to integrate UROPay with the existing Next.js + Supabase project. It includes:

- Environment variables you should set
- How the server creates a payment row and requests a UROPay checkout
- A webhook endpoint to verify events from UROPay and mark payments completed
- Notes and next steps (test keys, security)

Important: UROPay's public API details (endpoint paths, request/response fields and webhook signature method) may differ from the examples below. Use this guide as a drop-in template; copy the exact request/response fields and signature verification method from https://www.uropay.me/documentation and replace the placeholder fields below.

## 1) Environment variables

Add required keys to your `.env.local` (server-side values):

```
PAYMENT_PROVIDER=uropay
UROPAY_API_BASE=https://api.uropay.me   # or the base URL from UROPay docs
UROPAY_API_KEY=sk_test_xxx                # server API key / secret
UROPAY_WEBHOOK_SECRET=whsec_xxx          # webhook secret for verification
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

Only set these on the server (do not commit to git).

## 2) Server: create payment record and request a UROPay checkout

The existing server route `src/app/api/payments/session/route.ts` inserts a `payments` row and then calls the configured provider. When `PAYMENT_PROVIDER=uropay` the route will:

- Insert a `payments` row with status `pending` and `amount_minor` (paise)
- Call UROPay's payment creation API (POST) with amount, currency, and a callback/webhook metadata object
- Save the provider-specific session id (if returned) to the `payments` row
- Return a `checkoutUrl` to the client which the client should redirect to/open

The example implementation in the repository uses a generic POST to `${UROPAY_API_BASE}/v1/payments` and expects the provider to return a `checkout_url` and an `id`. Adapt the path and fields to the exact UROPay API.

## 3) Client: redirect to checkout

The payments page (`/payments`) will call `/api/payments/session` and expect either:

- A `url` (Stripe session redirect) or
- A `checkoutUrl` (UROPay hosted checkout URL) or
- An object with `orderId`/`key` (Razorpay-style in-page widget)

The included client code already redirects to `checkoutUrl` when present.

## 4) Webhook: verify and mark payment completed

Create a webhook endpoint in your app (example: `/api/payments/uropay-webhook`) and configure the webhook URL in the UROPay dashboard to point to it.

The example webhook handler provided in the repository:

- Reads the raw request body
- Verifies a HMAC SHA256 signature in header `x-uropay-signature` (this is a common pattern; replace with the exact header name and algorithm from UROPay docs)
- Parses the payload, extracts the `payment_id` (from metadata or the provider payload), and updates the payments row:
  - Set `status = 'completed'`
  - Save the provider payload to `metadata` JSONB for auditing

Adjust signature verification to match UROPay's webhook docs exactly. If they use a different algorithm, replace the verification code.

## 5) Testing & security

- Use UROPay test API keys when testing locally.
- Configure the webhook in UROPay dashboard to send test events to your local/ngrok URL while testing.
- Always verify webhook signatures server-side.
- Keep API keys and webhook secrets out of source control.

## 6) Next steps & provisioning

Once a payment is verified you may want to:

- Create a `subscriptions` row for the user or
- Update a `users`->`is_pro` flag in Supabase or
- Generate invoices/receipts and send email

The repository contains a minimal webhook handler and will mark the payments row `completed` and write the provider payload into the `metadata` column. Customize provisioning and subscription creation to match your business logic.

If you want, I can now adapt the example to the exact UROPay request/response fields from their docs and wire the final redirect/checkout flow.

``` 
````
