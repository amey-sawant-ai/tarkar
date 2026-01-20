import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { apiSuccess, apiError, requireAuth } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id] - Get single order details
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    const order = await Order.findOne({ 
      _id: id, 
      userId: auth.userId 
    }).lean();
    
    if (!order) {
      return apiError("NOT_FOUND", "Order not found", 404);
    }
    
    return apiSuccess(order);
    
  } catch (error) {
    console.error("Get order error:", error);
    return apiError("SERVER_ERROR", "Failed to get order", 500);
  }
}
