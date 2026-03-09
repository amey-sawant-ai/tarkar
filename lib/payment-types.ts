/**
 * Payment System Types for Tarkari
 * Supports Razorpay and Cash on Delivery (COD)
 */

// ========== Razorpay Types ==========

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, unknown>;
  created_at: number;
}

export interface RazorpayPaymentResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayPaymentHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayPaymentHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayWindow extends Window {
  Razorpay?: {
    new (options: RazorpayCheckoutOptions): {
      open: () => void;
      close: () => void;
    };
  };
}

// ========== Payment Verification Types ==========

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}

export interface VerifyPaymentResponse {
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

export interface ConfirmCODRequest {
  orderId: string;
}

export interface ConfirmCODResponse {
  success: boolean;
  data?: {
    message: string;
    orderId: string;
    status: string;
    paymentMethod: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

// ========== Database Payment Schema ==========

export interface PaymentDetails {
  method: "razorpay" | "cod" | "upi" | "card";
  status: "pending" | "completed" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: Date;
  failedAt?: Date;
  failureReason?: string;
}

export interface OrderTimeline {
  status: string;
  label: string;
  at: Date;
  completed: boolean;
}

export interface OrderPayment {
  method: "razorpay" | "cod";
  status: "pending" | "completed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: Date;
}
