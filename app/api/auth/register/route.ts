import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { apiSuccess, apiError, parseBody, validateRequired } from "@/lib/api-helpers";
import { generateAuthToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface RegisterBody {
  email: string;
  name: string;
  password: string;
  phone?: string;
}

// POST /api/auth/register - Register a new user with password
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await parseBody<RegisterBody>(request);
    const validation = validateRequired(body, ["email", "name", "password"]);
    
    if (!validation.valid) {
      return apiError(
        "VALIDATION_ERROR",
        "Email, name, and password are required",
        400,
        validation.errors
      );
    }
    
    const { email, name, password, phone } = validation.data;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiError("VALIDATION_ERROR", "Invalid email format", 400);
    }
    
    // Validate name length
    if (name.trim().length < 2) {
      return apiError("VALIDATION_ERROR", "Name must be at least 2 characters", 400);
    }
    
    // Validate password strength
    if (password.length < 8) {
      return apiError("VALIDATION_ERROR", "Password must be at least 8 characters", 400);
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingUser) {
      return apiError(
        "CONFLICT",
        "User with this email already exists",
        409
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with default preferences
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      phone: phone?.trim() || undefined,
      walletBalancePaise: 0,
      preferences: { 
        darkMode: false, 
        language: "en" 
      },
      notifications: { 
        orderUpdates: true, 
        promotions: true, 
        newsletter: false, 
        sms: true 
      },
    });
    
    // Generate authentication token
    const token = generateAuthToken(user._id.toString());
    
    return apiSuccess(
      {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          createdAt: user.createdAt,
        },
        token,
      },
      undefined,
      201
    );
    
  } catch (error) {
    console.error("Register error:", error);
    return apiError("SERVER_ERROR", "Failed to register user", 500);
  }
}
