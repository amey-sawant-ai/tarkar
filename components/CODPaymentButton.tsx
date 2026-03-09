"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CODPaymentButtonProps {
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  isDisabled?: boolean;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
}

interface ConfirmPaymentResponse {
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

export default function CODPaymentButton({
  orderId,
  onSuccess,
  onError,
  isDisabled = false,
  className = "",
  variant = "outline",
  size = "default",
}: CODPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const { clearCart } = useCart();
  const router = useRouter();

  const handleCODPayment = async () => {
    try {
      setLoading(true);

      // ✅ Validate auth
      if (!token || !user) {
        showToast("Please log in to proceed", "error");
        return;
      }

      // ✅ Confirm order with COD payment method
      const response = await fetch("/api/payment/confirm-cod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: orderId,
        }),
      });

      const data = (await response.json()) as ConfirmPaymentResponse;

      if (data.success) {
        showToast("Order confirmed! Payment due on delivery.", "success");
        clearCart();
        onSuccess?.();

        setTimeout(() => {
          router.push(`/dashboard/order-tracking?orderId=${orderId}`);
        }, 1500);
      } else {
        showToast(data.error?.message || "Failed to confirm order", "error");
        onError?.(data.error?.message || "Failed to confirm");
      }
    } catch (error) {
      console.error("COD payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to confirm order";
      showToast(errorMessage, "error");
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCODPayment}
      disabled={isDisabled || loading || !user || !token}
      className={className}
      variant={variant}
      size={size}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Confirming...
        </>
      ) : (
        "Pay on Delivery"
      )}
    </Button>
  );
}
