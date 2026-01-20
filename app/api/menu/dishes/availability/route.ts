import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Dish } from "@/models/Dish";
import { apiSuccess, apiError } from "@/lib/api-helpers";

// GET /api/menu/dishes/availability - Get all dishes with availability status
export async function GET() {
  try {
    await connectToDatabase();

    const dishes = await Dish.find({})
      .select("name isAvailable pricePaise")
      .populate("categoryId", "name")
      .sort({ name: 1 });

    return apiSuccess(dishes);
  } catch (error) {
    console.error("Error fetching dish availability:", error);
    return apiError("SERVER_ERROR", "Failed to fetch dish availability", 500);
  }
}

// PUT /api/menu/dishes/availability - Update dish availability
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const { dishId, isAvailable } = await req.json();

    if (!dishId || typeof isAvailable !== "boolean") {
      return apiError("VALIDATION_ERROR", "dishId and isAvailable are required", 400);
    }

    const dish = await Dish.findByIdAndUpdate(
      dishId,
      { isAvailable },
      { new: true }
    ).select("name isAvailable");

    if (!dish) {
      return apiError("NOT_FOUND", "Dish not found", 404);
    }

    console.log(`🍽️ Dish availability updated: ${dish.name} - ${isAvailable ? 'Available' : 'Unavailable'}`);

    return apiSuccess({
      id: dish._id,
      name: dish.name,
      isAvailable: dish.isAvailable
    });

  } catch (error) {
    console.error("Error updating dish availability:", error);
    return apiError("SERVER_ERROR", "Failed to update dish availability", 500);
  }
}