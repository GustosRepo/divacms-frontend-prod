# DivaCMS Monorepo

Full-stack project containing:
- **backend/** Express + Supabase + Stripe + Shippo (inventory, orders, auth, blog)
- **frontend/** Next.js (App Router) storefront + admin blog/product UI

## Prerequisites
- Node 18+
- pnpm or npm (repo currently uses npm lockfiles)
- Stripe account (test mode) + webhook signing secret
- Supabase project (Postgres + storage)
- (Optional) Shippo API key if you want auto label purchasing
- ngrok (or other HTTPS tunnel) for local Stripe webhooks

## Environment Variables (backend/.env)
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_BUCKET=public
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...            # IMPORTANT: Must match current ngrok endpoint in Stripe dashboard
FRONTEND_URL=http://localhost:3000         # used for success/cancel URLs
SHIPPO_API_KEY=shippo_test_...             # optional
PORT=3001
```
Frontend may also require NEXT_PUBLIC_* variants if used (inspect code for any process.env.NEXT_PUBLIC...).

## Install
```bash
# backend
cd backend
npm install
# frontend
cd ../frontend
npm install
```

## Running (dev)
Backend (port 3001):
```bash
cd backend
npm run dev
```
Frontend (port 3000):
```bash
cd frontend
npm run dev
```

## CRITICAL: Start ngrok for backend
Stripe must reach the Express server (NOT the Next.js frontend). Expose port 3001:
```bash
ngrok http 3001
```
Grab the https URL it prints, e.g. `https://abcd1234.ngrok-free.app` and configure Stripe webhook endpoint as:
```
https://abcd1234.ngrok-free.app/api/webhooks/stripe
```
Then copy the newly generated Signing secret (starts with `whsec_`) into backend `.env` as STRIPE_WEBHOOK_SECRET and restart the backend.

Test connectivity:
```bash
curl -i https://abcd1234.ngrok-free.app/api/webhooks/stripe
# Expect: { "ok": true, "path": "/api/webhooks/stripe", "method": "GET" }
```
Send a test event from Stripe dashboard (checkout.session.completed) and watch backend console for:
```
🚀 Incoming Stripe Webhook
✅ Stripe signature verified: checkout.session.completed
✅ Order inserted: <uuid>
🛒 Creating order_items...
✅ Decremented stock for product ...
```
If you see a 404 HTML page instead, Stripe is hitting the frontend (port 3000) — you started the wrong tunnel.

## Inventory Decrement Flow
1. Frontend creates Checkout Session with `metadata.items` (JSON string array of {id,q,p}).
2. Stripe sends `checkout.session.completed` to webhook.
3. `stripeWebhookHandler` inserts row into `order`, creates `order_item` records, then calls `decrementProductQuantity` for each item.
4. Fallback logic updates stock even if the RPC fails.

## Manual Stock Fix
If a webhook was missed you can run (inside backend):
```bash
node fix-stock.js <productId> <qty>
```
(Adjust script arguments if needed; current script may have product id hard coded.)

## Blog
- Backend exposes CRUD at `/api/blog`.
- Frontend pages: `/blog` list, `/blog/[id]` individual post with admin edit.

## Product Filtering
Use query params:
```
/products?brand_segment=toys&category_slug=vinyl-figures
```
Synonym handling allows short forms (e.g. `vinyl`).

## Common Issues
| Symptom | Cause | Fix |
|--------|-------|-----|
| Stripe 404 + Next.js HTML | Tunnel points to frontend | Run `ngrok http 3001` and update endpoint |
| No stock decrement | Webhook not received | Steps above; verify logs |
| RPC ambiguous id error | DB function returns ambiguous column | Fallback handles; refactor RPC later |
| GET /uploads/undefined requests | Missing image field in a product | Ensure image upload returns URL |

## Updating Stripe API Version
Library pinned to 2022-11-15; incoming events may be on newer version. To align:
1. Update Stripe dashboard default version or set in code when upgrading.
2. Re-test webhook signature after changes.

## Deployment Notes
- Replace ngrok with a stable domain + HTTPS.
- Ensure STRIPE_WEBHOOK_SECRET matches deployed endpoint (different from local).
- Lock down CORS origins if needed.

## Next Improvements (Optional)
- Add tests for webhook handler + product filtering.
- Harden decrement with DB-side transactional function.
- Admin UI for reprocessing failed webhooks.

---
Generated documentation – keep this updated when routes or env keys change.
