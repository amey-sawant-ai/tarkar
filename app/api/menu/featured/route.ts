import connectToDatabase from "@/lib/mongodb";
import { Dish } from "@/models/Dish";
import { apiSuccess, apiError } from "@/lib/api-helpers";

// GET /api/menu/featured - Get featured and popular dishes
export async function GET() {
  try {
    await connectToDatabase();
    
    const [featured, popular, newDishes] = await Promise.all([
      // Featured dishes
      Dish.find({ isFeatured: true, isAvailable: true })
        .sort({ displayOrder: 1 })
        .limit(6)
        .populate("categoryId", "name slug")
        .lean(),
      
      // Popular dishes
      Dish.find({ isPopular: true, isAvailable: true })
        .sort({ avgRating: -1, totalReviews: -1 })
        .limit(6)
        .populate("categoryId", "name slug")
        .lean(),
      
      // New arrivals
      Dish.find({ isNew: true, isAvailable: true })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("categoryId", "name slug")
        .lean(),
    ]);
    
    return apiSuccess({
      featured,
      popular,
      newDishes,
    });
    
  } catch (error) {
    console.error("Get featured error:", error);
    return apiError("SERVER_ERROR", "Failed to get featured dishes", 500);
  }
}
