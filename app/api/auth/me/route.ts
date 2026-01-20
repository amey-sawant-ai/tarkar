import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { apiSuccess, apiError, requireAuth } from "@/lib/api-helpers";

// GET /api/auth/me - Get current user profile
export async function GET(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const user = await User.findById(auth.userId).lean();
    
    if (!user) {
      return apiError("NOT_FOUND", "User not found", 404);
    }
    
    return apiSuccess({
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      walletBalancePaise: user.walletBalancePaise,
      role: user.role || "user",
      isActive: user.isActive !== false,
      preferences: user.preferences,
      notifications: user.notifications,
      createdAt: user.createdAt,
    });
    
  } catch (error) {
    console.error("Get profile error:", error);
    return apiError("SERVER_ERROR", "Failed to get profile", 500);
  }
}
