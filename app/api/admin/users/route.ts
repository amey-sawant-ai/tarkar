import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models";
import { apiSuccess, apiError, requireAdmin, getPagination } from "@/lib/api-helpers";

// GET /api/admin/users - List all users with filters
export async function GET(request: NextRequest) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { page, pageSize, skip } = getPagination(request);
  const url = new URL(request.url);

  // Build filter
  const filter: Record<string, unknown> = {};

  const role = url.searchParams.get("role");
  if (role && role !== "all") {
    filter.role = role;
  }

  const search = url.searchParams.get("search");
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      User.countDocuments(filter),
    ]);

    return apiSuccess(users, {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return apiError("SERVER_ERROR", "Failed to fetch users", 500);
  }
}
