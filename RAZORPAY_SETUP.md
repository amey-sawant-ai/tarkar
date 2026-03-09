# Razorpay Integration Setup Guide

Quick setup instructions for enabling Razorpay payments in Tarkari.

## Step 1: Install Razorpay Package

```bash
npm install razorpay
```

## Step 2: Get Razorpay Credentials

1. Go to https://dashboard.razorpay.com
2. Sign up or log in
3. Navigate to **Settings → API Keys**
4. Copy your **Key ID** and **Key Secret**
5. Keep the Key Secret safe - don't commit it to git!

## Step 3: Add Environment Variables

Create or update `.env.local`:

```env
# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

**⚠️ Important**: 
- Never commit `.env.local` to git
- `RAZORPAY_KEY_SECRET` stays on backend only
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is safe to expose (public key)

## Step 4: Verify Order Model

Ensure your Order model in `models/Order.ts` includes a `payment` field:

```typescript
payment: {
  method: { type: String, enum: ["razorpay", "cod", "upi", "card"] },
  status: { type: String, enum: ["pending", "completed", "failed"] },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paidAt: Date,
}
```

## Step 5: Use in Checkout

Import and use the payment buttons in your checkout page:

```tsx
import PaymentButton from "@/components/PaymentButton";
import CODPaymentButton from "@/components/CODPaymentButton";

export default function CheckoutPage() {
  return (
    <>
      <PaymentButton
        orderId={orderId}
        amount={cartTotal}
      />
      <CODPaymentButton
        orderId={orderId}
      />
    </>
  );
}
```

Or use the pre-built checkout section:

```tsx
import CheckoutPaymentSection from "@/components/CheckoutPaymentSection";

export default function CheckoutPage() {
  return (
    <CheckoutPaymentSection
      orderId={orderId}
      deliveryAddress={address}
      onPaymentSuccess={() => router.push("/dashboard/orders")}
    />
  );
}
```

## Step 6: Test Payments

### Using Test Mode

1. Keep RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from **Settings → API Keys**
2. Razorpay automatically detects test/live based on key prefix:
   - `rzp_test_xxx` = Test mode
   - `rzp_live_xxx` = Live mode

### Test Cards

| Type | Card Number | CVV | Date |
|------|-------------|-----|------|
| Success | 4111 1111 1111 1111 | Any 3 digits | Any future date |
| Declined | 4100 0000 0000 0001 | Any 3 digits | Any future date |

### Test Flow

1. Create an order: `POST /api/orders`
2. Click "Pay with Razorpay"
3. Enter test card: `4111 1111 1111 1111`
4. Complete checkout
5. Payment verified and order status updated to `confirmed`
6. Redirected to order tracking

## Step 7: Verify Installation

Run tests to ensure everything works:

```bash
# Test build (includes TypeScript check)
npm run build

# Start dev server
npm run dev

# Test authentication
node test-auth.js

# Check database
npx tsx scripts/verify-login.ts
```

## Available Files

| File | Purpose |
|------|---------|
| `app/api/payment/create-order/route.ts` | Create Razorpay order |
| `app/api/payment/verify/route.ts` | Verify payment signature |
| `app/api/payment/confirm-cod/route.ts` | Confirm COD orders |
| `components/PaymentButton.tsx` | Razorpay checkout button |
| `components/CODPaymentButton.tsx` | COD confirmation button |
| `components/CheckoutPaymentSection.tsx` | Complete payment UI |
| `lib/payment-types.ts` | TypeScript types for payments |
| `docs/PAYMENT_INTEGRATION.md` | Complete technical docs |

## Troubleshooting

### "Cannot find module 'razorpay'"

```bash
npm install razorpay
npm run build
```

### "RAZORPAY_KEY_SECRET is not set"

Check `.env.local` has both keys:

```env
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key
```

### "Signature mismatch"

- Verify you're using the correct `RAZORPAY_KEY_SECRET`
- Check secret hasn't been rotated in Razorpay dashboard
- Ensure no spaces or extra characters in keys

### Payment modal not opening

- Check browser console for script loading errors
- Verify CDN is accessible: https://checkout.razorpay.com/v1/checkout.js
- Ensure you're authenticated and have valid token

### Order not being confirmed after payment

- Check backend logs for `/api/payment/verify` errors
- Verify Order model has `payment` and `timeline` fields
- Ensure User model has proper roles if admin checks applied

## Next Steps

1. ✅ Install and setup complete
2. 🔄 Integrate payment buttons into checkout flow
3. 🧪 Test with test credentials
4. 🔐 Set up live credentials when ready
5. 📊 Monitor payments in Razorpay dashboard
6. 💬 Set up order confirmation emails

For complete technical documentation, see `docs/PAYMENT_INTEGRATION.md`.
