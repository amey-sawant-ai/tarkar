import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { apiSuccess, apiError, requireAuth } from "@/lib/api-helpers";

interface ConfirmCODBody {
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

    // ✅ Parse request body
    const body = await request.json();
    const { orderId } = body as ConfirmCODBody;

    // ✅ Validate inputs
    if (!orderId) {
      return apiError("VALIDATION_ERROR", "orderId is required", 400);
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

    if (order.status !== "order-placed") {
      return apiError(
        "INVALID_REQUEST",
        "Only pending orders can be confirmed",
        400
      );
    }

    // ✅ Update order status to confirmed (COD)
    order.status = "confirmed";

    // ✅ Add timeline entry
    order.timeline.push({
      status: "confirmed",
      label: "Order Confirmed - Payment Due on Delivery",
      at: new Date(),
      completed: true,
    });

    // ✅ Store payment method as COD
    if (!order.payment) {
      order.payment = {};
    }
    order.payment.method = "cod";
    order.payment.status = "pending";

    await order.save();

    // ✅ Return success response
    return apiSuccess({
      message: "Order confirmed with COD payment method",
      orderId: order._id,
      status: order.status,
      paymentMethod: "cod",
    });
  } catch (error) {
    console.error("Confirm COD order error:", error);
    return apiError(
      "SERVER_ERROR",
      "Failed to confirm order",
      500
    );
  }
}
