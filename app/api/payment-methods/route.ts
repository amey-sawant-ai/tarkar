import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { PaymentMethod } from "@/models/PaymentMethod";
import { 
  apiSuccess, apiError, requireAuth, parseBody, validateRequired 
} from "@/lib/api-helpers";

// GET /api/payment-methods - Get user's payment methods
export async function GET(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const methods = await PaymentMethod.find({ userId: auth.userId })
      .sort({ isDefault: -1, lastUsedAt: -1 })
      .lean();
    
    return apiSuccess(methods);
    
  } catch (error) {
    console.error("Get payment methods error:", error);
    return apiError("SERVER_ERROR", "Failed to get payment methods", 500);
  }
}

// POST /api/payment-methods - Add new payment method
export async function POST(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const body = await parseBody<{
      type: "card" | "upi" | "netbanking" | "wallet";
      name: string;
      isDefault?: boolean;
      // Card specific
      cardNumberMasked?: string;
      expiry?: string;
      cardType?: "visa" | "mastercard" | "rupay" | "amex";
      // UPI specific
      upiId?: string;
      // Netbanking specific
      bankName?: string;
    }>(request);
    
    const validation = validateRequired(body, ["type", "name"]);
    
    if (!validation.valid) {
      return apiError("VALIDATION_ERROR", "Validation failed", 400, validation.errors);
    }
    
    const { type, name, isDefault, ...rest } = validation.data;
    
    // Validate type-specific fields
    if (type === "card" && !rest.cardNumberMasked) {
      return apiError("VALIDATION_ERROR", "Card number is required for card type", 400);
    }
    if (type === "upi" && !rest.upiId) {
      return apiError("VALIDATION_ERROR", "UPI ID is required for UPI type", 400);
    }
    if (type === "netbanking" && !rest.bankName) {
      return apiError("VALIDATION_ERROR", "Bank name is required for netbanking type", 400);
    }
    
    // If setting as default, unset other defaults
    if (isDefault) {
      await PaymentMethod.updateMany(
        { userId: auth.userId, isDefault: true },
        { $set: { isDefault: false } }
      );
    }
    
    const method = await PaymentMethod.create({
      userId: auth.userId,
      type,
      name,
      isDefault: isDefault || false,
      ...rest,
    });
    
    return apiSuccess(method, undefined, 201);
    
  } catch (error) {
    console.error("Add payment method error:", error);
    return apiError("SERVER_ERROR", "Failed to add payment method", 500);
  }
}
