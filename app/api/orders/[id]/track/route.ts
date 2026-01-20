import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { apiSuccess, apiError, requireAuth } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id]/track - Get order tracking info
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    const order = await Order.findOne({ 
      _id: id, 
      userId: auth.userId 
    })
      .select("_id status timeline delivery address placedAt")
      .lean();
    
    if (!order) {
      return apiError("NOT_FOUND", "Order not found", 404);
    }
    
    // Calculate estimated delivery time
    const estimatedDeliveryMinutes = (() => {
      switch (order.status) {
        case "order-placed": return 45;
        case "confirmed": return 40;
        case "preparing": return 30;
        case "ready": return 20;
        case "out-for-delivery": return 10;
        default: return 0;
      }
    })();
    
    return apiSuccess({
      orderId: order._id,
      status: order.status,
      timeline: order.timeline,
      delivery: order.delivery,
      address: order.address,
      placedAt: order.placedAt,
      estimatedDeliveryMinutes,
      canCancel: ["order-placed", "confirmed"].includes(order.status),
    });
    
  } catch (error) {
    console.error("Track order error:", error);
    return apiError("SERVER_ERROR", "Failed to get tracking info", 500);
  }
}
