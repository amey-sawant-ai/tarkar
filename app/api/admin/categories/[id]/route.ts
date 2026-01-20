import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Category } from "@/models";
import { apiSuccess, apiError, requireAdmin, errors } from "@/lib/api-helpers";

// GET /api/admin/categories/[id] - Get category details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  try {
    const category = await Category.findById(id).lean();

    if (!category) {
      return errors.notFound("Category not found");
    }

    return apiSuccess(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return apiError("Failed to fetch category", 500);
  }
}

// PATCH /api/admin/categories/[id] - Update category
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

    // Remove _id if present
    delete body._id;

    // If updating slug, check for uniqueness
    if (body.slug) {
      const existing = await Category.findOne({
        slug: body.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError("Category with this slug already exists", 400);
      }
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!category) {
      return errors.notFound("Category not found");
    }

    return apiSuccess(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return apiError("Failed to update category", 500);
  }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return errors.notFound("Category not found");
    }

    return apiSuccess({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return apiError("Failed to delete category", 500);
  }
}
