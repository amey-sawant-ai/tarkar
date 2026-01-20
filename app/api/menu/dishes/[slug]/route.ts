import connectToDatabase from "@/lib/mongodb";
import { Dish } from "@/models/Dish";
import { Review } from "@/models/Review";
import { apiSuccess, apiError } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/menu/dishes/[slug] - Get single dish by slug
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    const { slug } = await params;
    
    const dish = await Dish.findOne({ slug, isAvailable: true })
      .populate("categoryId", "name slug")
      .lean();
    
    if (!dish) {
      return apiError("NOT_FOUND", "Dish not found", 404);
    }
    
    // Get recent reviews for this dish
    const reviews = await Review.find({ 
      dishId: dish._id, 
      status: "approved" 
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    return apiSuccess({
      ...dish,
      recentReviews: reviews,
    });
    
  } catch (error) {
    console.error("Get dish error:", error);
    return apiError("SERVER_ERROR", "Failed to get dish", 500);
  }
}
