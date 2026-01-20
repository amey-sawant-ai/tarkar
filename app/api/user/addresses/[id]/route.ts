import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Address } from "@/models/Address";
import { apiSuccess, apiError, requireAuth, parseBody } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/user/addresses/[id] - Get single address
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    const address = await Address.findOne({ 
      _id: id, 
      userId: auth.userId,
      isActive: true 
    }).lean();
    
    if (!address) {
      return apiError("NOT_FOUND", "Address not found", 404);
    }
    
    return apiSuccess(address);
    
  } catch (error) {
    console.error("Get address error:", error);
    return apiError("SERVER_ERROR", "Failed to get address", 500);
  }
}

// PUT /api/user/addresses/[id] - Update address
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    const body = await parseBody<{
      label?: string;
      fullName?: string;
      phone?: string;
      addressLine1?: string;
      addressLine2?: string;
      landmark?: string;
      city?: string;
      state?: string;
      pincode?: string;
      deliveryInstructions?: string;
      isDefault?: boolean;
    }>(request);
    
    if (!body) {
      return apiError("BAD_REQUEST", "Request body is required", 400);
    }
    
    // If setting as default, unset other defaults
    if (body.isDefault) {
      await Address.updateMany(
        { userId: auth.userId, isDefault: true, _id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }
    
    const address = await Address.findOneAndUpdate(
      { _id: id, userId: auth.userId, isActive: true },
      { $set: body },
      { new: true }
    ).lean();
    
    if (!address) {
      return apiError("NOT_FOUND", "Address not found", 404);
    }
    
    return apiSuccess(address);
    
  } catch (error) {
    console.error("Update address error:", error);
    return apiError("SERVER_ERROR", "Failed to update address", 500);
  }
}

// DELETE /api/user/addresses/[id] - Soft delete address
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    const address = await Address.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { $set: { isActive: false } },
      { new: true }
    );
    
    if (!address) {
      return apiError("NOT_FOUND", "Address not found", 404);
    }
    
    return apiSuccess({ message: "Address deleted successfully" });
    
  } catch (error) {
    console.error("Delete address error:", error);
    return apiError("SERVER_ERROR", "Failed to delete address", 500);
  }
}
