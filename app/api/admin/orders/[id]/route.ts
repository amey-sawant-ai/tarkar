import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order, User } from "@/models";
import { apiSuccess, apiError, requireAdmin, errors } from "@/lib/api-helpers";

// GET /api/admin/orders/[id] - Get order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  try {
    const order = await Order.findById(id).lean();

    if (!order) {
      return errors.notFound("Order not found");
    }

    // Get user details
    const user = await User.findById(order.userId)
      .select("name email phone")
      .lean();

    return apiSuccess({
      ...order,
      user: user || null,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return apiError("SERVER_ERROR", "Failed to fetch order", 500);
  }
}
