import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { WalletTransaction } from "@/models/WalletTransaction";
import { apiSuccess, apiError, requireAuth, parseBody } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/orders/[id]/cancel - Cancel an order
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const body = await parseBody<{ reason?: string }>(request);
    
    // Find the order
    const order = await Order.findOne({ 
      _id: id, 
      userId: auth.userId 
    });
    
    if (!order) {
      return apiError("NOT_FOUND", "Order not found", 404);
    }
    
    // Check if order can be cancelled
    const cancellableStatuses = ["order-placed", "confirmed"];
    if (!cancellableStatuses.includes(order.status)) {
      return apiError(
        "BAD_REQUEST", 
        `Order cannot be cancelled. Current status: ${order.status}`, 
        400
      );
    }
    
    // Update order status
    order.status = "cancelled";
    order.timeline.push({
      status: "cancelled",
      label: "Order cancelled",
      at: new Date(),
      completed: true,
    });
    
    await order.save();
    
    // Process refund to wallet
    const refundAmount = order.billing.totalPaise;
    
    if (refundAmount > 0) {
      // Update user wallet balance
      const user = await User.findByIdAndUpdate(
        auth.userId,
        { $inc: { walletBalancePaise: refundAmount } },
        { new: true }
      );
      
      // Create refund transaction
      await WalletTransaction.create({
        userId: auth.userId,
        type: "refund",
        amountPaise: refundAmount,
        description: `Refund for cancelled order #${order._id}`,
        orderId: order._id.toString(),
        balanceAfterPaise: user?.walletBalancePaise || 0,
      });
    }
    
    return apiSuccess({
      message: "Order cancelled successfully",
      order: order.toObject(),
      refundAmount,
    });
    
  } catch (error) {
    console.error("Cancel order error:", error);
    return apiError("SERVER_ERROR", "Failed to cancel order", 500);
  }
}
