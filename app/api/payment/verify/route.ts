import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import connectToDatabase from "@/lib/mongodb";
import { apiSuccess, apiError, requireAuth } from "@/lib/api-helpers";

interface VerifyPaymentBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}

export async function POST(request: NextRequest) {
  try {
    // ✅ FIRST: Connect to database
    await connectToDatabase();

    // ✅ SECOND: Check authentication
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    // ✅ Validate environment variable
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("Missing RAZORPAY_KEY_SECRET in environment");
      return apiError(
        "SERVER_ERROR",
        "Payment verification not configured",
        500
      );
    }

    // ✅ Parse request body
    const body = await request.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = body as VerifyPaymentBody;

    // ✅ Validate inputs
    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !orderId
    ) {
      return apiError(
        "VALIDATION_ERROR",
        "Missing required payment verification fields",
        400
      );
    }

    // ✅ Verify Razorpay signature
    const hmac = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    const message = `${razorpayOrderId}|${razorpayPaymentId}`;
    hmac.update(message);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpaySignature) {
      console.warn(
        `Payment signature mismatch for order ${orderId}. Expected: ${generatedSignature}, Got: ${razorpaySignature}`
      );
      return apiError(
        "PAYMENT_VERIFICATION_FAILED",
        "Payment verification failed. Signature mismatch.",
        400
      );
    }

    // ✅ Import Order model
    const { Order } = await import("@/models");

    // ✅ Verify order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return apiError("NOT_FOUND", "Order not found", 404);
    }

    // ✅ Update order status to confirmed
    if (order.status === "order-placed") {
      order.status = "confirmed";

      // ✅ Add timeline entry
      order.timeline.push({
        status: "confirmed",
        label: "Payment Confirmed",
        at: new Date(),
        completed: true,
      });

      // ✅ Store Razorpay payment details
      if (!order.payment) {
        order.payment = {};
      }
      order.payment.razorpayOrderId = razorpayOrderId;
      order.payment.razorpayPaymentId = razorpayPaymentId;
      order.payment.method = "razorpay";
      order.payment.status = "completed";
      order.payment.paidAt = new Date();

      await order.save();
    }

    // ✅ Return success response
    return apiSuccess({
      message: "Payment verified successfully",
      orderId: order._id,
      status: order.status,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return apiError(
      "SERVER_ERROR",
      "Failed to verify payment",
      500
    );
  }
}
