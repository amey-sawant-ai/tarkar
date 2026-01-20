import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Category } from "@/models";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api-helpers";

// GET /api/admin/categories - List all categories
export async function GET(request: NextRequest) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  try {
    const categories = await Category.find()
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return apiSuccess(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return apiError("Failed to fetch categories", 500);
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  try {
    const body = await request.json();
    const { name, slug, description, image } = body;

    if (!name || !slug) {
      return apiError("Name and slug are required", 400);
    }

    // Check if slug already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return apiError("Category with this slug already exists", 400);
    }

    // Get max sort order
    const maxOrder = await Category.findOne()
      .sort({ sortOrder: -1 })
      .select("sortOrder")
      .lean();

    const category = await Category.create({
      name,
      slug,
      description: description || "",
      image: image || "",
      isActive: true,
      sortOrder: (maxOrder?.sortOrder || 0) + 1,
    });

    return apiSuccess(category, undefined, 201);
  } catch (error) {
    console.error("Error creating category:", error);
    return apiError("Failed to create category", 500);
  }
}
