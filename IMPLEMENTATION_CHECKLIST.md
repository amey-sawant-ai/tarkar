# Implementation Checklist - Razorpay Integration

Copy this checklist and mark items as completed!

## Phase 1: Setup (15 minutes)

- [ ] **Install Razorpay SDK**
  ```bash
  npm install razorpay
  ```
  Verify: `npm list razorpay`

- [ ] **Get Razorpay Credentials**
  - [ ] Go to https://dashboard.razorpay.com/app/settings/api-keys
  - [ ] Copy Key ID (starts with `rzp_test_` or `rzp_live_`)
  - [ ] Copy Key Secret (keep safe!)

- [ ] **Add Environment Variables**
  - [ ] Open `.env.local`
  - [ ] Add `RAZORPAY_KEY_ID=your_key_id`
  - [ ] Add `RAZORPAY_KEY_SECRET=your_secret_key`
  - [ ] Add `NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id`
  - [ ] Verify file is in `.gitignore`

- [ ] **Verify Order Model**
  - [ ] Open `models/Order.ts`
  - [ ] Check for `payment` field:
    ```typescript
    payment: {
      method: String,
      status: String,
      razorpayOrderId: String,
      razorpayPaymentId: String,
      paidAt: Date,
    }
    ```
  - [ ] Add if missing
  - [ ] Run `npm run build` to verify types

- [ ] **Run Build**
  ```bash
  npm run build
  ```
  Should complete without errors

---

## Phase 2: Review Code (10 minutes)

- [ ] **Review Backend Routes**
  - [ ] `app/api/payment/create-order/route.ts` (132 lines)
  - [ ] `app/api/payment/verify/route.ts` (107 lines)
  - [ ] `app/api/payment/confirm-cod/route.ts` (65 lines)

- [ ] **Review Frontend Components**
  - [ ] `components/PaymentButton.tsx` (173 lines)
  - [ ] `components/CODPaymentButton.tsx` (90 lines)
  - [ ] `components/CheckoutPaymentSection.tsx` (185 lines)

- [ ] **Review Type Definitions**
  - [ ] `lib/payment-types.ts` (90 lines)

---

## Phase 3: Integration (20 minutes)

### Option A: Quick Integration (Use Pre-built Component)

- [ ] **Import CheckoutPaymentSection**
  ```tsx
  import CheckoutPaymentSection from "@/components/CheckoutPaymentSection";
  ```

- [ ] **Add to Checkout Page**
  ```tsx
  <CheckoutPaymentSection
    orderId={orderId}
    deliveryAddress={address}
    onPaymentSuccess={() => router.push("/dashboard/orders")}
  />
  ```

- [ ] **Test locally**
  - [ ] Run `npm run dev`
  - [ ] Create an order
  - [ ] Click "Pay with Razorpay"
  - [ ] Use test card: `4111 1111 1111 1111`
  - [ ] Complete checkout
  - [ ] Verify order status updated to "confirmed"

### Option B: Custom Integration (Use Individual Buttons)

- [ ] **Import Components**
  ```tsx
  import PaymentButton from "@/components/PaymentButton";
  import CODPaymentButton from "@/components/CODPaymentButton";
  ```

- [ ] **Add to Checkout**
  ```tsx
  <PaymentButton orderId={id} amount={total} />
  <CODPaymentButton orderId={id} />
  ```

- [ ] **Add Selection Logic**
  - [ ] Store selected payment method in state
  - [ ] Show/hide buttons based on selection
  - [ ] Handle callbacks (onSuccess, onError)

- [ ] **Test locally**
  - [ ] Run `npm run dev`
  - [ ] Test Razorpay flow
  - [ ] Test COD flow
  - [ ] Test error scenarios

---

## Phase 4: Testing (15 minutes)

### Razorpay Payments

- [ ] **Test Success Payment**
  - [ ] Card: `4111 1111 1111 1111`
  - [ ] CVV: Any 3 digits
  - [ ] Date: Any future date
  - [ ] Verify order status → "confirmed"
  - [ ] Verify payment details stored
  - [ ] Verify timeline entry added

- [ ] **Test Declined Payment**
  - [ ] Card: `4100 0000 0000 0001`
  - [ ] Verify error message shown
  - [ ] Verify order status stays "order-placed"

- [ ] **Test Payment Modal Closure**
  - [ ] Open Razorpay modal
  - [ ] Click X to close
  - [ ] Verify "Payment cancelled" toast shown
  - [ ] Verify can retry

- [ ] **Test Network Errors**
  - [ ] Simulate network error in DevTools
  - [ ] Verify error handling
  - [ ] Verify user sees error message

### COD Orders

- [ ] **Test COD Confirmation**
  - [ ] Click "Pay on Delivery"
  - [ ] Verify order status → "confirmed"
  - [ ] Verify payment.method = "cod"
  - [ ] Verify timeline entry added

### General

- [ ] **Test Authentication**
  - [ ] Logout and try payment → Should redirect to login
  - [ ] Verify authorization header sent

- [ ] **Test Order Ownership**
  - [ ] Try to pay for another user's order → Should fail

- [ ] **Test Cart Clearing**
  - [ ] Add items to cart
  - [ ] Proceed to checkout
  - [ ] Complete payment
  - [ ] Verify cart is empty

- [ ] **Test Notifications**
  - [ ] Verify success toast appears
  - [ ] Verify error toasts appear
  - [ ] Verify success message content

- [ ] **Test Redirect**
  - [ ] Complete payment
  - [ ] Verify redirect to order tracking page
  - [ ] Verify correct order ID in URL

---

## Phase 5: Production Preparation (10 minutes)

- [ ] **Switch to Live Keys**
  - [ ] Go to Razorpay dashboard
  - [ ] Get live keys (start with `rzp_live_`)
  - [ ] Update `.env.local` with live keys
  - [ ] Verify build still passes

- [ ] **Monitor Live Transactions**
  - [ ] Check Razorpay dashboard for test payments
  - [ ] Verify order IDs match
  - [ ] Verify payment amounts correct
  - [ ] Check payment method recorded

- [ ] **Enable Payment Email Notifications**
  - [ ] Configure Razorpay email settings
  - [ ] Test email delivery
  - [ ] Share details with customer support

- [ ] **Setup Payment Reconciliation**
  - [ ] Document daily reconciliation process
  - [ ] Setup automated payment verification (optional)
  - [ ] Create backup payment reversal process

- [ ] **Create User Documentation**
  - [ ] Document payment methods supported
  - [ ] Document how to retry failed payments
  - [ ] Document refund process
  - [ ] Create FAQ for common payment issues

---

## Phase 6: Deployment (5 minutes)

- [ ] **Final Build Test**
  ```bash
  npm run build
  npm run lint
  ```
  Both should pass

- [ ] **Deploy to Staging**
  - [ ] Push to staging branch
  - [ ] Verify build in CI/CD
  - [ ] Test payments in staging
  - [ ] Check logs for errors

- [ ] **Deploy to Production**
  - [ ] Merge to main/production branch
  - [ ] Trigger production deployment
  - [ ] Monitor payment transactions
  - [ ] Setup alert if payment fails

- [ ] **Post-Deployment Verification**
  - [ ] Process a test payment
  - [ ] Verify it appears in Razorpay dashboard
  - [ ] Verify order status updated in database
  - [ ] Verify email notifications sent
  - [ ] Verify user can track order

---

## Phase 7: Monitoring (Ongoing)

- [ ] **Daily Checks**
  - [ ] Review failed payments in dashboard
  - [ ] Check order-to-payment ratio
  - [ ] Monitor payment success rate

- [ ] **Weekly Checks**
  - [ ] Reconcile payments with orders
  - [ ] Review error logs
  - [ ] Check customer complaints

- [ ] **Monthly Checks**
  - [ ] Analyze payment trends
  - [ ] Review popular payment methods
  - [ ] Plan feature improvements
  - [ ] Update documentation if needed

---

## Files Modified/Created

### Created Files (Count: 11)
- [x] `app/api/payment/create-order/route.ts`
- [x] `app/api/payment/verify/route.ts`
- [x] `app/api/payment/confirm-cod/route.ts`
- [x] `components/PaymentButton.tsx`
- [x] `components/CODPaymentButton.tsx`
- [x] `components/CheckoutPaymentSection.tsx`
- [x] `lib/payment-types.ts`
- [x] `docs/PAYMENT_INTEGRATION.md`
- [x] `RAZORPAY_SETUP.md`
- [x] `PAYMENT_QUICK_REFERENCE.md`
- [x] `RAZORPAY_INTEGRATION_COMPLETE.md`

### Updated Files (Count: 1)
- [x] `.github/copilot-instructions.md` - Added payment integration section

### Modified Files (Count: 0)
- [ ] No model files needed to be modified (payment field optional)

---

## Rollback Plan

If issues arise:

1. **Remove from production**
   - Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` to empty/null
   - Redirect payment page to COD-only

2. **Debug locally**
   - Check `.env.local` values
   - Check database payment fields
   - Check Razorpay API response

3. **Common fixes**
   - Verify `razorpay` package installed
   - Verify environment variables set
   - Restart dev server
   - Clear `.next` cache and rebuild

4. **Contact support**
   - Razorpay: https://support.razorpay.com
   - Check logs in Razorpay dashboard
   - Reference transaction ID

---

## Success Criteria

✅ All checklist items completed
✅ Build passes without errors
✅ Test payments successful
✅ Order status updates correctly
✅ Cart clears after payment
✅ User gets success notification
✅ Order redirects to tracking page
✅ Razorpay dashboard shows payments
✅ No console errors
✅ Documentation complete

---

## Time Estimates

| Phase | Tasks | Time |
|-------|-------|------|
| Setup | Install, env vars, verify | 15 min |
| Review | Read code files | 10 min |
| Integration | Add to checkout | 20 min |
| Testing | Manual tests | 15 min |
| Production | Switch keys, deploy | 10 min |
| Monitoring | Daily/weekly checks | Ongoing |
| **TOTAL** | **All phases** | **70 min** |

---

## Notes

- Keep `.env.local` in `.gitignore` (never commit secrets)
- Use test keys for development/staging
- Switch to live keys only for production
- Monitor Razorpay dashboard daily for first week
- Document any issues found during testing
- Update team documentation after completion

---

**Last Updated**: 2026-03-09
**Status**: Ready for implementation
**Next Action**: Run `npm install razorpay`

Good luck! 🚀
