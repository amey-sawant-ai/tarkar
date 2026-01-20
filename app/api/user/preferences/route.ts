import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { apiSuccess, apiError, requireAuth, parseBody, validateRequired } from "@/lib/api-helpers";

// GET /api/user/preferences - Get user preferences
export async function GET(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const user = await User.findById(auth.userId).lean();
    
    if (!user) {
      return apiError("NOT_FOUND", "User not found", 404);
    }
    
    return apiSuccess(user.preferences || {
      darkMode: false,
      language: "en",
    });
    
  } catch (error) {
    console.error("Get preferences error:", error);
    return apiError("SERVER_ERROR", "Failed to get preferences", 500);
  }
}

// PUT /api/user/preferences - Update user preferences
export async function PUT(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const body = await parseBody<{
      darkMode?: boolean;
      language?: "en" | "hi" | "mr";
    }>(request);
    
    if (!body) {
      return apiError("BAD_REQUEST", "Request body is required", 400);
    }
    
    // Validate language if provided
    if (body.language && !["en", "hi", "mr"].includes(body.language)) {
      return apiError("VALIDATION_ERROR", "Invalid language. Must be en, hi, or mr", 400);
    }
    
    const updateData: any = {};
    if (body.darkMode !== undefined) {
      updateData["preferences.darkMode"] = body.darkMode;
    }
    if (body.language) {
      updateData["preferences.language"] = body.language;
    }
    
    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $set: updateData },
      { new: true }
    ).lean();
    
    if (!user) {
      return apiError("NOT_FOUND", "User not found", 404);
    }
    
    return apiSuccess(user.preferences);
    
  } catch (error) {
    console.error("Update preferences error:", error);
    return apiError("SERVER_ERROR", "Failed to update preferences", 500);
  }
}
