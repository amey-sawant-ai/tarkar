import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Dish, Category } from "@/models";
import { apiSuccess, apiError, requireAdmin, errors } from "@/lib/api-helpers";

// GET /api/admin/dishes/[id] - Get dish details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  try {
    const dish = await Dish.findById(id)
      .populate("categoryId", "name slug")
      .lean();

    if (!dish) {
      return errors.notFound("Dish not found");
    }

    return apiSuccess(dish);
  } catch (error) {
    console.error("Error fetching dish:", error);
    return apiError("Failed to fetch dish", 500);
  }
}

// PATCH /api/admin/dishes/[id] - Update dish
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

    // Remove _id if present to avoid conflicts
    delete body._id;

    // Convert pricePaise to number if present
    if (body.pricePaise) {
      body.pricePaise = parseInt(body.pricePaise, 10);
    }

    // If category slug is provided, look up categoryId
    if (body.category) {
      const categoryDoc = await Category.findOne({ slug: body.category });
      if (categoryDoc) {
        body.categoryId = categoryDoc._id;
      }
      delete body.category;
    }

    // Map image to imageUrl
    if (body.image !== undefined) {
      body.imageUrl = body.image;
      delete body.image;
    }

    // Map spiceLevel to spicyLevel
    if (body.spiceLevel !== undefined) {
      body.spicyLevel = body.spiceLevel;
      delete body.spiceLevel;
    }

    const dish = await Dish.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate("categoryId", "name slug")
      .lean();

    if (!dish) {
      return errors.notFound("Dish not found");
    }

    return apiSuccess(dish);
  } catch (error) {
    console.error("Error updating dish:", error);
    return apiError("Failed to update dish", 500);
  }
}

// DELETE /api/admin/dishes/[id] - Delete dish
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  try {
    const dish = await Dish.findByIdAndDelete(id);

    if (!dish) {
      return errors.notFound("Dish not found");
    }

    return apiSuccess({ message: "Dish deleted successfully" });
  } catch (error) {
    console.error("Error deleting dish:", error);
    return apiError("Failed to delete dish", 500);
  }
}
