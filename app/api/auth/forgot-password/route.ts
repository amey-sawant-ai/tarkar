import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import { hashPassword } from "@/lib/auth";

// POST /api/auth/forgot-password
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return apiError("VALIDATION_ERROR", "Email and new password are required", 400);
    }

    if (newPassword.length < 6) {
      return apiError("VALIDATION_ERROR", "Password must be at least 6 characters", 400);
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return apiError("USER_NOT_FOUND", "No account found with this email address", 404);
    }

    // Hash new password and update user
    const hashedPassword = await hashPassword(newPassword);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword
    });

    console.log(`✅ Password updated successfully for user: ${email}`);

    return apiSuccess({ 
      message: "Password updated successfully. You can now login with your new password." 
    });

  } catch (error) {
    console.error("Password reset error:", error);
    return apiError("SERVER_ERROR", "Failed to update password", 500);
  }
}