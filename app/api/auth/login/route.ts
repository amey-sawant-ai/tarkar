import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { apiSuccess, apiError, parseBody, validateRequired } from "@/lib/api-helpers";
import { generateAuthToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface LoginBody {
  email: string;
  password: string;
}

// POST /api/auth/login - Login user with email and password
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await parseBody<LoginBody>(request);
    const validation = validateRequired(body, ["email", "password"]);

    if (!validation.valid) {
      return apiError(
        "VALIDATION_ERROR",
        "Email and password are required",
        400,
        validation.errors
      );
    }

    const { email, password } = validation.data;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiError("VALIDATION_ERROR", "Invalid email format", 400);
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({
      email: email.toLowerCase()
    }).lean();

    if (!user) {
      // Don't reveal if user exists - security best practice
      return apiError(
        "INVALID_CREDENTIALS",
        "Invalid email or password",
        401
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Don't reveal that email exists but password is wrong
      return apiError(
        "INVALID_CREDENTIALS",
        "Invalid email or password",
        401
      );
    }

    // Check if account is disabled
    if (user.isActive === false) {
      return apiError(
        "ACCOUNT_DISABLED",
        "Your account has been disabled. Please contact support.",
        403
      );
    }

    // Generate authentication token
    const token = generateAuthToken(user._id.toString(), user.role || "user");

    return apiSuccess({
      token,
      user: {
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
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return apiError("SERVER_ERROR", "Failed to login", 500);
  }
}
