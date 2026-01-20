import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order, User } from "@/models";
import { apiSuccess, apiError, requireAdmin, errors } from "@/lib/api-helpers";

const validStatuses = [
  "order-placed",
  "confirmed",
  "preparing",
  "ready",
  "out-for-delivery",
  "delivered",
  "cancelled",
];

// PATCH /api/admin/orders/[id]/status - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !validStatuses.includes(status)) {
      return apiError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        400
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return errors.notFound("Order not found");
    }

    // Check if order is already delivered or cancelled
    if (order.status === "delivered" && status !== "delivered") {
      return apiError("Cannot change status of delivered order", 400);
    }

    if (order.status === "cancelled" && status !== "cancelled") {
      return apiError("Cannot change status of cancelled order", 400);
    }

    // Update status
    order.status = status;
    await order.save();

    // Get user details
    const user = await User.findById(order.userId)
      .select("name email phone")
      .lean();

    return apiSuccess({
      ...order.toObject(),
      user: user || null,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return apiError("Failed to update order status", 500);
  }
}
