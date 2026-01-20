import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { apiSuccess, apiError, requireAuth, parseBody } from "@/lib/api-helpers";

// GET /api/user/notifications - Get notification preferences
export async function GET(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const user = await User.findById(auth.userId).lean();
    
    if (!user) {
      return apiError("NOT_FOUND", "User not found", 404);
    }
    
    return apiSuccess(user.notifications || {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
      sms: true,
    });
    
  } catch (error) {
    console.error("Get notifications error:", error);
    return apiError("SERVER_ERROR", "Failed to get notification preferences", 500);
  }
}

// PUT /api/user/notifications - Update notification preferences
export async function PUT(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const body = await parseBody<{
      orderUpdates?: boolean;
      promotions?: boolean;
      newsletter?: boolean;
      sms?: boolean;
    }>(request);
    
    if (!body) {
      return apiError("BAD_REQUEST", "Request body is required", 400);
    }
    
    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $set: { notifications: body } },
      { new: true }
    ).lean();
    
    if (!user) {
      return apiError("NOT_FOUND", "User not found", 404);
    }
    
    return apiSuccess(user.notifications);
    
  } catch (error) {
    console.error("Update notifications error:", error);
    return apiError("SERVER_ERROR", "Failed to update notification preferences", 500);
  }
}
