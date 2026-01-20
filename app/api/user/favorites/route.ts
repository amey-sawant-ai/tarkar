import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Favorite } from "@/models/Favorite";
import { Dish } from "@/models/Dish";
import { Category } from "@/models/Category";
import { apiSuccess, apiError, requireAuth, parseBody, validateRequired } from "@/lib/api-helpers";

// GET user's favorite dishes
export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();

    console.log("Fetching favorites for user:", auth.userId);

    const favorites = await Favorite.find({ userId: auth.userId })
      .populate("dishId")
      .lean();
    
    console.log("Found favorites:", favorites.length);
    
    // Filter out favorites where dish was deleted and format the response
    const validFavorites = favorites
      .filter(fav => {
        if (!fav.dishId) {
          console.log("Skipping favorite with missing dish");
          return false;
        }
        return true;
      })
      .map(fav => {
        const dish = fav.dishId as any;
        return {
          _id: dish._id.toString(),
          name: dish.name,
          shortDescription: dish.shortDescription || "",
          pricePaise: dish.pricePaise,
          imageUrl: dish.imageUrl || "",
          isVeg: dish.isVeg || false,
          isSpicy: dish.isSpicy || false,
          slug: dish.slug,
          categoryId: undefined, // Remove category for now to avoid population issues
          orderCount: (fav as any).orderCount || 0,
          lastOrderedAt: (fav as any).lastOrderedAt || null,
        };
      });
    
    console.log("Valid favorites:", validFavorites.length);
    return apiSuccess(validFavorites);
    
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return apiError("SERVER_ERROR", "Failed to fetch favorites", 500);
  }
}

// POST - Add or remove favorite
export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();

    const body = await parseBody<{ dishId: string }>(req);
    const validation = validateRequired(body, ["dishId"]);
    
    if (!validation.valid) {
      return apiError("VALIDATION_ERROR", "dishId is required", 400, validation.errors);
    }
    
    const { dishId } = validation.data;

    // Check if dish exists
    const dish = await Dish.findById(dishId).lean();
    if (!dish) {
      return apiError("NOT_FOUND", "Dish not found", 404);
    }

    // Check if already favorited
    const existing = await Favorite.findOne({ userId: auth.userId, dishId }).lean();

    if (existing) {
      // Remove favorite
      await Favorite.deleteOne({ userId: auth.userId, dishId });
      return apiSuccess({
        message: "Removed from favorites",
        isFavorite: false,
      });
    } else {
      // Add favorite
      await Favorite.create({ userId: auth.userId, dishId });
      return apiSuccess({
        message: "Added to favorites",
        isFavorite: true,
      }, undefined, 201);
    }
    
  } catch (error) {
    console.error("Error managing favorite:", error);
    return apiError("SERVER_ERROR", "Failed to manage favorite", 500);
  }
}
