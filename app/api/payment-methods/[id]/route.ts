import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { PaymentMethod } from "@/models/PaymentMethod";
import { apiSuccess, apiError, requireAuth, parseBody } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/payment-methods/[id] - Get single payment method
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    const method = await PaymentMethod.findOne({ 
      _id: id, 
      userId: auth.userId 
    }).lean();
    
    if (!method) {
      return apiError("NOT_FOUND", "Payment method not found", 404);
    }
    
    return apiSuccess(method);
    
  } catch (error) {
    console.error("Get payment method error:", error);
    return apiError("SERVER_ERROR", "Failed to get payment method", 500);
  }
}

// PUT /api/payment-methods/[id] - Update payment method
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    const body = await parseBody<{
      name?: string;
      isDefault?: boolean;
    }>(request);
    
    if (!body) {
      return apiError("BAD_REQUEST", "Request body is required", 400);
    }
    
    // If setting as default, unset other defaults
    if (body.isDefault) {
      await PaymentMethod.updateMany(
        { userId: auth.userId, isDefault: true, _id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }
    
    const method = await PaymentMethod.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { $set: body },
      { new: true }
    ).lean();
    
    if (!method) {
      return apiError("NOT_FOUND", "Payment method not found", 404);
    }
    
    return apiSuccess(method);
    
  } catch (error) {
    console.error("Update payment method error:", error);
    return apiError("SERVER_ERROR", "Failed to update payment method", 500);
  }
}

// DELETE /api/payment-methods/[id] - Delete payment method
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    const method = await PaymentMethod.findOneAndDelete({ 
      _id: id, 
      userId: auth.userId 
    });
    
    if (!method) {
      return apiError("NOT_FOUND", "Payment method not found", 404);
    }
    
    return apiSuccess({ message: "Payment method deleted successfully" });
    
  } catch (error) {
    console.error("Delete payment method error:", error);
    return apiError("SERVER_ERROR", "Failed to delete payment method", 500);
  }
}
