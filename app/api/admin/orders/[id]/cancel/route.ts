import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order, User, WalletTransaction } from "@/models";
import { apiSuccess, apiError, requireAdmin, errors } from "@/lib/api-helpers";

// POST /api/admin/orders/[id]/cancel - Cancel order and optionally refund to wallet
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  try {
    const body = await request.json();
    const { reason, refundToWallet = true } = body;

    if (!reason || reason.trim().length < 3) {
      return apiError("Cancellation reason is required (min 3 characters)", 400);
    }

    const order = await Order.findById(id);

    if (!order) {
      return errors.notFound("Order not found");
    }

    // Check if order is already cancelled
    if (order.status === "cancelled") {
      return apiError("Order is already cancelled", 400);
    }

    // Check if order is already delivered - cannot cancel
    if (order.status === "delivered") {
      return apiError("Cannot cancel a delivered order", 400);
    }

    const totalPaise = order.billing.totalPaise || 0;
    let refundTransaction = null;
    let newWalletBalance = 0;

    // Process refund if requested and payment was not COD
    if (refundToWallet && totalPaise > 0) {
      const user = await User.findById(order.userId);

      if (user) {
        // Calculate new wallet balance
        const currentBalance = user.walletBalancePaise || 0;
        newWalletBalance = currentBalance + totalPaise;

        // Update user wallet balance
        user.walletBalancePaise = newWalletBalance;
        await user.save();

        // Create refund transaction record
        refundTransaction = await WalletTransaction.create({
          userId: order.userId,
          type: "refund",
          amountPaise: totalPaise,
          description: `Refund for cancelled order #${order._id.toString().slice(-6).toUpperCase()} - ${reason}`,
          orderId: order._id.toString(),
          balanceAfterPaise: newWalletBalance,
          idempotencyKey: `refund-${order._id}-${Date.now()}`,
        });
      }
    }

    // Update order status to cancelled
    order.status = "cancelled";

    // Add cancellation to timeline
    order.timeline.push({
      status: "cancelled",
      label: "Order Cancelled",
      at: new Date(),
      completed: true,
    });

    // Store cancellation reason in notes
    order.notes = order.notes
      ? `${order.notes}\n\nCancellation Reason: ${reason}`
      : `Cancellation Reason: ${reason}`;

    await order.save();

    // Get user details for response
    const userDetails = await User.findById(order.userId)
      .select("name email phone walletBalancePaise")
      .lean();

    return apiSuccess({
      order: {
        ...order.toObject(),
        user: userDetails || null,
      },
      refund: refundToWallet && totalPaise > 0
        ? {
            amountPaise: totalPaise,
            transactionId: refundTransaction?._id,
            newWalletBalance,
          }
        : null,
      message: refundToWallet && totalPaise > 0
        ? `Order cancelled and ₹${(totalPaise / 100).toFixed(2)} refunded to wallet`
        : "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return apiError("Failed to cancel order", 500);
  }
}
