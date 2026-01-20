import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { apiSuccess, apiError, getPagination, paginatedResponse, parseBody, validateRequired } from "@/lib/api-helpers";

interface CategoryBody {
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

// GET /api/menu/categories - Get all categories
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";
    
    const query = activeOnly ? { isActive: true } : {};
    
    const categories = await Category.find(query)
      .sort({ displayOrder: 1, name: 1 })
      .lean();
    
    return apiSuccess(categories);
    
  } catch (error) {
    console.error("Get categories error:", error);
    return apiError("SERVER_ERROR", "Failed to get categories", 500);
  }
}

// POST /api/menu/categories - Create new category
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await parseBody<CategoryBody>(request);
    const validation = validateRequired(body, ["name", "slug"]);
    
    if (!validation.valid) {
      return apiError(
        "VALIDATION_ERROR",
        "Name and slug are required",
        400,
        validation.errors
      );
    }
    
    const { name, slug, description, displayOrder, isActive } = validation.data;
    
    // Check if category already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return apiError("CONFLICT", "Category with this slug already exists", 409);
    }
    
    // Create new category
    const category = await Category.create({
      name,
      slug,
      description: description || "",
      displayOrder: displayOrder || 0,
      isActive: isActive !== false,
    });
    
    return apiSuccess(category, undefined, 201);
  } catch (error) {
    console.error("Create category error:", error);
    return apiError("SERVER_ERROR", "Failed to create category", 500);
  }
}
