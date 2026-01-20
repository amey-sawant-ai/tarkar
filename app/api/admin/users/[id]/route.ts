import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models";
import { apiSuccess, apiError, requireAdmin, errors } from "@/lib/api-helpers";

// GET /api/admin/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  try {
    const user = await User.findById(id).select("-passwordHash").lean();

    if (!user) {
      return errors.notFound("User not found");
    }

    return apiSuccess(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return apiError("Failed to fetch user", 500);
  }
}

// PATCH /api/admin/users/[id] - Update user (role, isActive)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  try {
    const body = await request.json();

    // Only allow updating specific fields
    const allowedFields = ["role", "isActive"];
    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Validate role if provided
    if (updates.role && !["user", "admin", "staff"].includes(updates.role as string)) {
      return apiError("Invalid role. Must be 'user', 'admin', or 'staff'", 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .select("-passwordHash")
      .lean();

    if (!user) {
      return errors.notFound("User not found");
    }

    return apiSuccess(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return apiError("Failed to update user", 500);
  }
}
