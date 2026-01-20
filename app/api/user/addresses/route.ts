import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Address } from "@/models/Address";
import { 
  apiSuccess, apiError, requireAuth, parseBody, validateRequired 
} from "@/lib/api-helpers";

// GET /api/user/addresses - Get user addresses
export async function GET(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const addresses = await Address.find({ 
      userId: auth.userId, 
      isActive: true 
    })
      .sort({ isDefault: -1, updatedAt: -1 })
      .lean();
    
    return apiSuccess(addresses);
    
  } catch (error) {
    console.error("Get addresses error:", error);
    return apiError("SERVER_ERROR", "Failed to get addresses", 500);
  }
}

// POST /api/user/addresses - Add new address
export async function POST(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const body = await parseBody<{
      label: string;
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      landmark?: string;
      city: string;
      state: string;
      pincode: string;
      deliveryInstructions?: string;
      isDefault?: boolean;
    }>(request);
    
    const validation = validateRequired(body, [
      "label", "fullName", "phone", "addressLine1", "city", "state", "pincode"
    ]);
    
    if (!validation.valid) {
      return apiError("VALIDATION_ERROR", "Validation failed", 400, validation.errors);
    }
    
    // If setting as default, unset other defaults
    if (body?.isDefault) {
      await Address.updateMany(
        { userId: auth.userId, isDefault: true },
        { $set: { isDefault: false } }
      );
    }
    
    const address = await Address.create({
      userId: auth.userId,
      ...validation.data,
    });
    
    return apiSuccess(address, undefined, 201);
    
  } catch (error) {
    console.error("Add address error:", error);
    return apiError("SERVER_ERROR", "Failed to add address", 500);
  }
}
