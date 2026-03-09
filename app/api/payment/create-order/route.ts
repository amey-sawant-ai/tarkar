import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { apiSuccess, apiError, requireAuth } from "@/lib/api-helpers";
import Razorpay from "razorpay";

interface CreateOrderBody {
  amount: number; // in paise
  orderId: string;
}

interface RazorpayOrderResponse {
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

export async function POST(request: NextRequest) {
  try {
    // ✅ FIRST: Connect to database
    await connectToDatabase();

    // ✅ SECOND: Check authentication
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    // ✅ Validate environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay credentials in environment");
      return apiError(
        "SERVER_ERROR",
        "Payment gateway not configured",
        500
      );
    }

    // ✅ Parse request body
    const body = await request.json();
    const { amount, orderId } = body as CreateOrderBody;

    // ✅ Validate inputs
    if (!amount || !orderId) {
      return apiError(
        "VALIDATION_ERROR",
        "Amount and orderId are required",
        400
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return apiError(
        "VALIDATION_ERROR",
        "Amount must be a positive number in paise",
        400
      );
    }

    // ✅ Import Order model
    const { Order } = await import("@/models");

    // Verify the order exists and belongs to the user
    const order = await Order.findOne({
      _id: orderId,
      userId,
    }).select("_id status billing");

    if (!order) {
      console.error(`Order not found: ${orderId} for user ${userId}`);
      return apiError("NOT_FOUND", "Order not found", 404);
    }

    if (order.status !== "order-placed") {
      console.error(`Order status is ${order.status}, expected order-placed`);
      return apiError(
        "INVALID_REQUEST",
        `Order status is ${order.status}, only pending orders can be paid`,
        400
      );
    }

    // ✅ Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // ✅ Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount), // ensure it's an integer in paise
      currency: "INR",
      receipt: `tarkari_${orderId}`,
      notes: {
        orderId: orderId,
        userId: userId,
      },
    }) as RazorpayOrderResponse;

    // ✅ Return success response
    return apiSuccess({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    // Log the full error details
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Handle Razorpay specific errors
      if (error.message.includes("RAZORPAY") || error.message.includes("Authentication")) {
        return apiError(
          "PAYMENT_ERROR",
          `Payment gateway error: ${error.message}`,
          500
        );
      }
    }

    return apiError(
      "SERVER_ERROR",
      error instanceof Error ? error.message : "Failed to create payment order",
      500
    );
  }
}
