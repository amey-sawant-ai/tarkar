import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { hashPassword } from "@/lib/auth";

// POST /api/auth/reset-password
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { token, password } = await req.json();

    if (!token || !password) {
      return apiError("VALIDATION_ERROR", "Token and password are required", 400);
    }

    if (password.length < 6) {
      return apiError("VALIDATION_ERROR", "Password must be at least 6 characters", 400);
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return apiError("INVALID_TOKEN", "Invalid or expired reset token", 400);
    }

    // Hash new password and update user
    const hashedPassword = await hashPassword(password);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      $unset: {
        resetToken: 1,
        resetTokenExpiry: 1
      }
    });

    console.log(`✅ Password reset successful for user: ${user.email}`);

    return apiSuccess({ 
      message: "Password reset successful. You can now login with your new password." 
    });

  } catch (error) {
    console.error("Password reset error:", error);
    return apiError("SERVER_ERROR", "Failed to reset password", 500);
  }
}

// GET /api/auth/reset-password - Verify reset token
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return apiError("VALIDATION_ERROR", "Token is required", 400);
    }

    // Check if token is valid and not expired
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    }).select("email");

    if (!user) {
      return apiError("INVALID_TOKEN", "Invalid or expired reset token", 400);
    }

    return apiSuccess({ 
      valid: true,
      email: user.email 
    });

  } catch (error) {
    console.error("Reset token verification error:", error);
    return apiError("SERVER_ERROR", "Failed to verify token", 500);
  }
}