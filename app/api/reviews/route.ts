import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { Dish } from "@/models/Dish";
import { User } from "@/models/User";
import { 
  apiSuccess, apiError, requireAuth, 
  parseBody, validateRequired, getPagination, paginatedResponse 
} from "@/lib/api-helpers";

// GET /api/reviews - Get reviews with filters
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPagination(request);
    
    const query: Record<string, unknown> = { status: "approved" };
    
    // Filter by dish
    const dishId = searchParams.get("dishId");
    if (dishId) {
      query.dishId = dishId;
    }
    
    // Filter by rating
    const minRating = searchParams.get("minRating");
    if (minRating) {
      query.rating = { $gte: parseInt(minRating, 10) };
    }
    
    // Filter by verified
    const verified = searchParams.get("verified");
    if (verified === "true") {
      query.isVerified = true;
    }
    
    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    
    const [total, reviews] = await Promise.all([
      Review.countDocuments(query),
      Review.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(pageSize)
        .populate("dishId", "name slug imageUrl")
        .lean(),
    ]);
    
    return paginatedResponse(reviews, total, page, pageSize);
    
  } catch (error) {
    console.error("Get reviews error:", error);
    return apiError("SERVER_ERROR", "Failed to get reviews", 500);
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const body = await parseBody<{
      dishId: string;
      orderId?: string;
      rating: number;
      title?: string;
      comment?: string;
      photos?: string[];
    }>(request);
    
    const validation = validateRequired(body, ["dishId", "rating"]);
    
    if (!validation.valid) {
      return apiError("VALIDATION_ERROR", "Validation failed", 400, validation.errors);
    }
    
    const { dishId, orderId, rating, title, comment, photos } = validation.data;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return apiError("VALIDATION_ERROR", "Rating must be between 1 and 5", 400);
    }
    
    // Check if dish exists
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return apiError("NOT_FOUND", "Dish not found", 404);
    }
    
    // Get user info
    const user = await User.findById(auth.userId).lean();
    
    // Check if user already reviewed this dish
    const existingReview = await Review.findOne({
      userId: auth.userId,
      dishId,
    });
    
    if (existingReview) {
      return apiError("CONFLICT", "You have already reviewed this dish", 409);
    }
    
    // Create review
    const review = await Review.create({
      userId: auth.userId,
      userName: user?.name || "Anonymous",
      userAvatarUrl: user?.avatarUrl,
      dishId,
      orderId,
      rating,
      title,
      comment,
      photos: photos || [],
      isVerified: !!orderId, // Verified if associated with an order
      status: "pending", // Requires moderation
    });
    
    // Update dish rating (simple average)
    const allReviews = await Review.find({ 
      dishId, 
      status: "approved" 
    }).lean();
    
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0) + rating;
    const avgRating = totalRating / (allReviews.length + 1);
    
    await Dish.findByIdAndUpdate(dishId, {
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length + 1,
    });
    
    return apiSuccess(review, undefined, 201);
    
  } catch (error) {
    console.error("Create review error:", error);
    return apiError("SERVER_ERROR", "Failed to create review", 500);
  }
}
