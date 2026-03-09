"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface RazorpayWindow extends Window {
  Razorpay?: {
    new (options: any): any;
  };
}

interface PaymentButtonProps {
  orderId: string;
  amount: number; // in paise
  onSuccess?: () => void;
  onError?: (error: string) => void;
  isDisabled?: boolean;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
}

interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  data?: {
    message: string;
    orderId: string;
    status: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Script loader for Razorpay checkout
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentButton({
  orderId,
  amount,
  onSuccess,
  onError,
  isDisabled = false,
  className = "",
  variant = "default",
  size = "default",
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const { clearCart } = useCart();
  const router = useRouter();

  const handlePayment = async () => {
    try {
      setLoading(true);

      // ✅ Validate auth
      if (!token || !user) {
        showToast("Please log in to proceed with payment", "error");
        return;
      }

      // ✅ Load Razorpay script dynamically
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        showToast("Failed to load payment gateway. Please try again.", "error");
        onError?.("Failed to load Razorpay script");
        return;
      }

      // ✅ Create payment order on backend
      const createOrderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          orderId: orderId,
        }),
      });

      const createOrderData = await createOrderResponse.json();

      if (!createOrderData.success) {
        showToast(
          createOrderData.error?.message || "Failed to create payment order",
          "error"
        );
        onError?.(createOrderData.error?.message || "Failed to create order");
        return;
      }

      const paymentOrder = createOrderData.data as RazorpayOrderResponse;

      // ✅ Open Razorpay checkout
      const window = globalThis as unknown as RazorpayWindow;
      if (!window.Razorpay) {
        showToast("Payment gateway not available", "error");
        onError?.("Razorpay not available");
        return;
      }

      const razorpay = new window.Razorpay({
        key: paymentOrder.key,
        order_id: paymentOrder.razorpayOrderId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Tarkari",
        description: `Order Payment #${orderId}`,
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#1B5E20", // Tarkari dark-green brand color
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // ✅ Verify payment on backend
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: orderId,
              }),
            });

            const verifyData = (await verifyResponse.json()) as VerifyPaymentResponse;

            if (verifyData.success) {
              // ✅ Payment successful
              showToast("Payment successful! Order confirmed.", "success");
              clearCart(); // Clear cart after successful payment
              onSuccess?.();

              // Redirect to order tracking
              setTimeout(() => {
                router.push(`/dashboard/order-tracking/${orderId}`);
              }, 1500);
            } else {
              showToast(
                verifyData.error?.message || "Payment verification failed",
                "error"
              );
              onError?.(verifyData.error?.message || "Verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            showToast("Payment verified but there was an issue. Please contact support.", "warning");
            onError?.(error instanceof Error ? error.message : "Verification error");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            showToast("Payment cancelled. You can retry anytime.", "info");
            setLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Payment failed";
      showToast(errorMessage, "error");
      onError?.(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isDisabled || loading || !user || !token}
      className={className}
      variant={variant}
      size={size}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        "Pay with Razorpay"
      )}
    </Button>
  );
}
