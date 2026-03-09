# Razorpay & COD Payment Integration - Tarkari

## Overview

This document outlines the complete payment integration for Tarkari, supporting:
1. **Razorpay** - Online payment gateway (credit/debit cards, UPI, wallets)
2. **COD** - Cash on Delivery (alternative payment method)

## Architecture

```
Frontend (PaymentButton/CODPaymentButton)
    ↓
Backend (API Routes)
    ↓
Razorpay API / Order Model
    ↓
Order Status Updated → "confirmed"
    ↓
Timeline Entry + Payment Details Stored
    ↓
Redirect to Order Tracking
```

## Setup Instructions

### 1. Install Razorpay SDK

```bash
npm install razorpay
```

### 2. Add Environment Variables

Create/update `.env.local`:

```env
# Razorpay Credentials (get from https://dashboard.razorpay.com/settings/api-keys)
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here

# Public key (safe to expose in frontend)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id_here
```

### 3. Database Schema Update

The Order model needs a `payment` field. Ensure your Order schema includes:

```typescript
payment: {
  method: { type: String, enum: ["razorpay", "cod"], default: "cod" },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paidAt: Date,
}
```

## API Routes

### POST `/api/payment/create-order`

**Purpose**: Create a Razorpay order for frontend checkout

**Request**:
```typescript
{
  amount: number;        // in paise (e.g., 29900 = ₹299.00)
  orderId: string;       // Tarkari order ID from MongoDB
}
```

**Headers**: `Authorization: Bearer <token>`

**Response**:
```typescript
{
  success: true,
  data: {
    razorpayOrderId: string;
    amount: number;        // in paise
    currency: "INR";
    key: string;          // NEXT_PUBLIC_RAZORPAY_KEY_ID
  }
}
```

**Error Cases**:
- 400: Missing/invalid amount or orderId
- 401: Unauthorized (no auth token)
- 404: Order not found or doesn't belong to user
- 400: Order not in "order-placed" status
- 500: Razorpay API error

---

### POST `/api/payment/verify`

**Purpose**: Verify Razorpay payment signature and confirm order

**Request**:
```typescript
{
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;        // Tarkari order ID
}
```

**Headers**: `Authorization: Bearer <token>`

**Process**:
1. Verify HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`
2. If valid: Update order status to "confirmed"
3. Add timeline entry: "Payment Confirmed"
4. Store Razorpay payment details

**Response**:
```typescript
{
  success: true,
  data: {
    message: "Payment verified successfully",
    orderId: string;
    status: "confirmed";
  }
}
```

**Error Cases**:
- 400: Signature mismatch (payment tampered or invalid)
- 400: Missing required fields
- 404: Order not found
- 500: Database error

---

### POST `/api/payment/confirm-cod`

**Purpose**: Confirm order with Cash on Delivery payment method

**Request**:
```typescript
{
  orderId: string;
}
```

**Headers**: `Authorization: Bearer <token>`

**Process**:
1. Verify order exists and belongs to user
2. Update order status to "confirmed"
3. Add timeline entry: "Order Confirmed - Payment Due on Delivery"
4. Set payment.method = "cod" and payment.status = "pending"

**Response**:
```typescript
{
  success: true,
  data: {
    message: "Order confirmed with COD payment method",
    orderId: string;
    status: "confirmed";
    paymentMethod: "cod";
  }
}
```

---

## Frontend Components

### PaymentButton (Razorpay)

**Location**: `components/PaymentButton.tsx`

**Props**:
```typescript
interface PaymentButtonProps {
  orderId: string;
  amount: number;           // in paise
  onSuccess?: () => void;
  onError?: (error: string) => void;
  isDisabled?: boolean;
  className?: string;
  variant?: "default" | "outline" | ...;
  size?: "default" | "sm" | "lg";
}
```

**Usage**:
```tsx
import PaymentButton from "@/components/PaymentButton";

export default function CheckoutPage() {
  const { cartTotal } = useCart();
  const orderId = "some-order-id";

  return (
    <PaymentButton
      orderId={orderId}
      amount={cartTotal}
      onSuccess={() => console.log("Payment successful")}
      onError={(error) => console.error(error)}
    />
  );
}
```

**Features**:
- Dynamically loads Razorpay checkout script
- Auto-fills customer name, email, phone from `useAuth()`
- Shows loading state while processing
- Calls `/api/payment/create-order` to create Razorpay order
- Opens Razorpay modal
- On success: Calls `/api/payment/verify` to confirm order
- Clears cart via `useCart().clearCart()`
- Shows toast notifications via `useToast()`
- Redirects to `/dashboard/order-tracking/{orderId}` on success
- Handles payment modal closure gracefully

---

### CODPaymentButton

**Location**: `components/CODPaymentButton.tsx`

**Props**:
```typescript
interface CODPaymentButtonProps {
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  isDisabled?: boolean;
  className?: string;
  variant?: "default" | "outline" | ...;
  size?: "default" | "sm" | "lg";
}
```

**Usage**:
```tsx
import CODPaymentButton from "@/components/CODPaymentButton";

export default function CheckoutPage() {
  const orderId = "some-order-id";

  return (
    <CODPaymentButton
      orderId={orderId}
      onSuccess={() => console.log("Order confirmed")}
      onError={(error) => console.error(error)}
    />
  );
}
```

**Features**:
- Simple order confirmation for COD
- Calls `/api/payment/confirm-cod` API
- Same notification and redirect flow as Razorpay
- Shows "Payment Due on Delivery" in timeline

---

## Integration in Checkout Flow

### Example Checkout Page

```tsx
"use client";

import { useState } from "react";
import PaymentButton from "@/components/PaymentButton";
import CODPaymentButton from "@/components/CODPaymentButton";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  // Step 1: Create order
  const handleCreateOrder = async () => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart.map((item) => ({
          dishId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddress: address,
        deliveryType: "delivery",
      }),
    });

    const data = await response.json();
    if (data.success) {
      setOrderId(data.data._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Review */}
      <div>
        <h2>Order Summary</h2>
        <p>Total: ₹{(cartTotal / 100).toFixed(2)}</p>
      </div>

      {/* Payment Method Selection */}
      {orderId && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value as "razorpay")}
              />
              Razorpay
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value as "cod")}
              />
              Cash on Delivery
            </label>
          </div>

          {/* Payment Buttons */}
          {paymentMethod === "razorpay" ? (
            <PaymentButton
              orderId={orderId}
              amount={cartTotal}
              className="w-full"
            />
          ) : (
            <CODPaymentButton
              orderId={orderId}
              className="w-full"
            />
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `RAZORPAY_KEY_NOT_CONFIGURED` | Missing env vars | Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local |
| `PAYMENT_VERIFICATION_FAILED` | Signature mismatch | Payment was tampered with. User should contact support |
| `ORDER_NOT_FOUND` | Invalid order ID | Verify orderId parameter |
| `INVALID_REQUEST` | Order not in "order-placed" status | Order already paid or cancelled |
| `PAYMENT_MODAL_CLOSED` | User closed payment modal | Show message: "Payment cancelled. Try again anytime." |

### Frontend Error Toast Pattern

```tsx
try {
  // Payment flow
} catch (error) {
  const message = error instanceof Error ? error.message : "Payment failed";
  showToast(message, "error");
  onError?.(message);
}
```

---

## Security Considerations

1. **Signature Verification**: Always verify Razorpay signature on backend using `RAZORPAY_KEY_SECRET`
2. **Token Validation**: All payment APIs require Bearer token authentication
3. **Amount Validation**: Backend validates amount matches order total
4. **Order Ownership**: Backend verifies order belongs to authenticated user
5. **Idempotency**: Duplicate payment verification calls are safe (status already updated)
6. **No Sensitive Data in Frontend**: Public key only, secret stays on backend

---

## Testing

### Test Credentials

Use Razorpay test mode cards:

- **Success Card**: `4111 1111 1111 1111`
- **Declined Card**: `4100 0000 0000 0001`
- **CVV**: Any 3 digits
- **Date**: Any future date

### Test Flow

1. Create order with `/api/orders`
2. Click "Pay with Razorpay"
3. Use test card `4111 1111 1111 1111`
4. Complete payment
5. Backend verifies signature and updates order status
6. User redirected to order tracking

### COD Test

1. Create order with `/api/orders`
2. Click "Pay on Delivery"
3. Order status updated to "confirmed"
4. No payment required

---

## Future Enhancements

- [ ] Partial refund support
- [ ] Multiple payment methods (Apple Pay, Google Pay)
- [ ] Recurring/subscription orders
- [ ] Payment failure retry logic
- [ ] Invoice generation on payment success
- [ ] SMS/Email confirmation with tracking link
- [ ] Admin payment reconciliation dashboard

---

## Support & Debugging

### Enable Debug Logs

Add to payment routes:

```typescript
console.log("Payment flow:", {
  orderId,
  amount,
  userId,
  signature: razorpaySignature,
});
```

### Razorpay Documentation

- **Dashboard**: https://dashboard.razorpay.com
- **API Docs**: https://razorpay.com/docs/api/
- **Support**: https://support.razorpay.com

### Common Issues

**Issue**: "Failed to load payment gateway"
- **Cause**: Script loading failed
- **Fix**: Check network tab in browser devtools, verify CORS

**Issue**: "Signature mismatch"
- **Cause**: Wrong RAZORPAY_KEY_SECRET
- **Fix**: Verify key from Razorpay dashboard

**Issue**: "Order not found"
- **Cause**: Invalid orderId or user mismatch
- **Fix**: Verify order was created and belongs to user
