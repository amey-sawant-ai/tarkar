"use client";

import { useState } from "react";
import PaymentButton from "@/components/PaymentButton";
import CODPaymentButton from "@/components/CODPaymentButton";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote } from "lucide-react";

interface CheckoutPaymentSectionProps {
  orderId: string;
  deliveryAddress?: string;
  onPaymentSuccess?: () => void;
}

/**
 * Example Checkout Payment Section
 * Demonstrates how to integrate PaymentButton and CODPaymentButton
 * 
 * Usage:
 * 1. Create order with POST /api/orders
 * 2. Get orderId from response
 * 3. Pass to this component
 * 4. User selects payment methinfo
 * 5. Component handles payment flow
 */
export default function CheckoutPaymentSection({
  orderId,
  deliveryAddress,
  onPaymentSuccess,
}: CheckoutPaymentSectionProps) {
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const { items, totalPrice } = useCart();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const handlePaymentSuccess = () => {
    showToast("Order confirmed! Track your order in the dashboard.", "success");
    onPaymentSuccess?.();
  };

  const handlePaymentError = (error: string) => {
    showToast(`Payment failed: ${error}`, "error");
  };

  if (!token || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>Please log in to proceed with payment</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Select how you&apos;d like to pay for your order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="bg-warm-beige/50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-dark-green">Order Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-green/70">Items</span>
              <span className="font-medium">{items.length} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-green/70">Subtotal</span>
              <span className="font-medium">₹{(totalPrice / 100).toFixed(2)}</span>
            </div>
            <div className="border-t border-dark-green/20 pt-2 flex justify-between font-semibold text-dark-green">
              <span>Total Amount</span>
              <span>₹{(totalPrice / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "razorpay" | "cod")}>
          <div className="space-y-4">
            {/* Razorpay Option */}
            <div className="flex items-center space-x-3 p-4 border border-dark-green/20 rounded-lg hover:border-dark-green/40 hover:bg-dark-green/5 cursor-pointer transition-colors">
              <RadioGroupItem value="razorpay" id="razorpay" className="border-dark-green" />
              <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-tomato-red" />
                  <div>
                    <div className="font-semibold text-dark-green">Online Payment</div>
                    <div className="text-sm text-dark-green/60">Credit/Debit Card, UPI, Wallet</div>
                  </div>
                </div>
              </Label>
            </div>

            {/* COD Option */}
            <div className="flex items-center space-x-3 p-4 border border-dark-green/20 rounded-lg hover:border-dark-green/40 hover:bg-dark-green/5 cursor-pointer transition-colors">
              <RadioGroupItem value="cod" id="cod" className="border-dark-green" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-saffron-yellow" />
                  <div>
                    <div className="font-semibold text-dark-green">Cash on Delivery</div>
                    <div className="text-sm text-dark-green/60">Pay when your order arrives</div>
                  </div>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>

        {/* Customer Details (Read-only) */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <h5 className="font-semibold text-dark-green">Delivery Details</h5>
          <div className="space-y-1 text-dark-green/70">
            <p>
              <strong>Name:</strong> {user.name || "Not provided"}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.phone && (
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
            )}
            {deliveryAddress && (
              <p>
                <strong>Address:</strong> {deliveryAddress}
              </p>
            )}
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="space-y-3">
          {paymentMethod === "razorpay" ? (
            <>
              <PaymentButton
                orderId={orderId}
                amount={totalPrice}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              />
              <p className="text-xs text-dark-green/60 text-center">
                Secured by Razorpay. Your payment information is encrypted.
              </p>
            </>
          ) : (
            <>
              <CODPaymentButton
                orderId={orderId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              />
              <p className="text-xs text-dark-green/60 text-center">
                You will pay the amount ₹{(totalPrice / 100).toFixed(2)} when the delivery arrives.
              </p>
            </>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="bg-warm-beige/30 rounded-lg p-3 text-xs text-dark-green/60">
          By clicking the payment button, you agree to our{" "}
          <a href="/terms" className="text-tomato-red hover:underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-tomato-red hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </CardContent>
    </Card>
  );
}
