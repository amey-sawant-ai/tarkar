# Payment Integration - Quick Reference

## Files Overview

### Backend Routes (`/app/api/payment/`)
```
create-order/route.ts     → POST /api/payment/create-order
verify/route.ts           → POST /api/payment/verify
confirm-cod/route.ts      → POST /api/payment/confirm-cod
```

### Frontend Components (`/components/`)
```
PaymentButton.tsx              → Razorpay checkout button
CODPaymentButton.tsx           → COD confirmation button
CheckoutPaymentSection.tsx     → Complete payment UI
```

### Configuration (`/lib/` & `/docs/`)
```
payment-types.ts               → TypeScript type definitions
PAYMENT_INTEGRATION.md         → Complete technical docs
RAZORPAY_SETUP.md             → Setup guide
```

---

## API Endpoints

### Create Razorpay Order
```
POST /api/payment/create-order
Authorization: Bearer <token>

Request:
{
  "amount": 29900,      // paise
  "orderId": "order-123"
}

Response (success):
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_xxxxx",
    "amount": 29900,
    "currency": "INR",
    "key": "rzp_test_xxxxx"
  }
}
```

### Verify Payment
```
POST /api/payment/verify
Authorization: Bearer <token>

Request:
{
  "razorpayOrderId": "order_xxxxx",
  "razorpayPaymentId": "pay_xxxxx",
  "razorpaySignature": "signature_hash",
  "orderId": "order-123"
}

Response (success):
{
  "success": true,
  "data": {
    "message": "Payment verified successfully",
    "orderId": "order-123",
    "status": "confirmed"
  }
}
```

### Confirm COD Order
```
POST /api/payment/confirm-cod
Authorization: Bearer <token>

Request:
{
  "orderId": "order-123"
}

Response (success):
{
  "success": true,
  "data": {
    "message": "Order confirmed with COD payment method",
    "orderId": "order-123",
    "status": "confirmed",
    "paymentMethod": "cod"
  }
}
```

---

## Component Usage

### PaymentButton
```tsx
import PaymentButton from "@/components/PaymentButton";

<PaymentButton
  orderId="order-123"
  amount={29900}
  onSuccess={() => console.log("paid")}
  onError={(err) => console.error(err)}
  className="w-full"
/>
```

### CODPaymentButton
```tsx
import CODPaymentButton from "@/components/CODPaymentButton";

<CODPaymentButton
  orderId="order-123"
  onSuccess={() => console.log("confirmed")}
  onError={(err) => console.error(err)}
/>
```

### CheckoutPaymentSection (Complete UI)
```tsx
import CheckoutPaymentSection from "@/components/CheckoutPaymentSection";

<CheckoutPaymentSection
  orderId="order-123"
  deliveryAddress="123 Main St"
  onPaymentSuccess={() => router.push("/orders")}
/>
```

---

## Environment Variables

Add to `.env.local`:
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
```

---

## Order Status Flow

```
order-placed
    ↓ (payment successful)
confirmed
    ↓ (kitchen starts preparing)
preparing
    ↓ (ready for delivery)
ready
    ↓ (out with delivery)
out-for-delivery
    ↓ (received by customer)
delivered

Alternative:
order-placed → cancelled (at any time)
```

---

## Test Cards

| Purpose | Card | CVV | Date |
|---------|------|-----|------|
| Success | 4111 1111 1111 1111 | 123 | 12/25 |
| Declined | 4100 0000 0000 0001 | 123 | 12/25 |

---

## Key Code Patterns

### API Route Pattern
```typescript
// ✅ Always in this order:
await connectToDatabase();
const authResult = requireAuth(request);
if (authResult instanceof NextResponse) return authResult;
const { userId } = authResult;

// ... rest of logic
return apiSuccess(data);
```

### Amounts in Paise
```typescript
// ✅ Store/transfer amounts as integers (paise)
const pricePaise = 29900;  // ₹299.00
const displayPrice = (pricePaise / 100).toFixed(2);  // "299.00"
```

### Error Handling
```typescript
try {
  // payment logic
  return apiSuccess(data);
} catch (error) {
  console.error("Error:", error);
  return apiError("ERROR_CODE", "User message", statusCode);
}
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| "razorpay not found" | Run `npm install razorpay` |
| Signature mismatch | Verify `RAZORPAY_KEY_SECRET` in .env.local |
| Order not found | Check order exists and belongs to user |
| Payment modal won't open | Check Razorpay script loaded, check browser console |
| Cart not cleared | Verify `useCart().clearCart()` is called |

---

## Integration Checklist

- [ ] Install: `npm install razorpay`
- [ ] Add env vars to `.env.local`
- [ ] Verify Order model has `payment` field
- [ ] Run `npm run build` to test
- [ ] Test with test cards locally
- [ ] Import PaymentButton or CheckoutPaymentSection
- [ ] Test end-to-end: order → payment → confirmation
- [ ] Switch to live keys when ready
- [ ] Monitor orders in Razorpay dashboard

---

## Documentation Links

- **Setup Guide**: `RAZORPAY_SETUP.md`
- **Technical Docs**: `docs/PAYMENT_INTEGRATION.md`
- **Code Instructions**: `.github/copilot-instructions.md`
- **Razorpay API**: https://razorpay.com/docs/

---

**Status**: ✅ Ready to use
