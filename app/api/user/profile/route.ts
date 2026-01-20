import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { apiSuccess, apiError, requireAuth, parseBody } from "@/lib/api-helpers";

// GET /api/user/profile - Get user profile
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
      preferences: user.preferences,
      notifications: user.notifications,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    
  } catch (error) {
    console.error("Get profile error:", error);
    return apiError("SERVER_ERROR", "Failed to get profile", 500);
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const body = await parseBody<{
      name?: string;
      phone?: string;
      avatarUrl?: string;
    }>(request);
    
    if (!body) {
      return apiError("BAD_REQUEST", "Request body is required", 400);
    }
    
    // Build update object
    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.phone) updateData.phone = body.phone;
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;
    
    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $set: updateData },
      { new: true }
    ).lean();
    
    if (!user) {
      return apiError("NOT_FOUND", "User not found", 404);
    }
    
    return apiSuccess({
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    });
    
  } catch (error) {
    console.error("Update profile error:", error);
    return apiError("SERVER_ERROR", "Failed to update profile", 500);
  }
}
