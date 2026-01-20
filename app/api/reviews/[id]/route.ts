import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { apiSuccess, apiError, requireAuth, parseBody } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/reviews/[id] - Get single review
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const review = await Review.findById(id)
      .populate("dishId", "name slug imageUrl")
      .lean();
    
    if (!review) {
      return apiError("NOT_FOUND", "Review not found", 404);
    }
    
    return apiSuccess(review);
    
  } catch (error) {
    console.error("Get review error:", error);
    return apiError("SERVER_ERROR", "Failed to get review", 500);
  }
}

// PUT /api/reviews/[id] - Update own review
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    const body = await parseBody<{
      rating?: number;
      title?: string;
      comment?: string;
      photos?: string[];
    }>(request);
    
    if (!body) {
      return apiError("BAD_REQUEST", "Request body is required", 400);
    }
    
    // Validate rating if provided
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return apiError("VALIDATION_ERROR", "Rating must be between 1 and 5", 400);
    }
    
    const review = await Review.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { $set: body },
      { new: true }
    ).lean();
    
    if (!review) {
      return apiError("NOT_FOUND", "Review not found or not owned by you", 404);
    }
    
    return apiSuccess(review);
    
  } catch (error) {
    console.error("Update review error:", error);
    return apiError("SERVER_ERROR", "Failed to update review", 500);
  }
}

// DELETE /api/reviews/[id] - Delete own review
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    const { id } = await params;
    
    await connectToDatabase();
    
    const review = await Review.findOneAndDelete({ 
      _id: id, 
      userId: auth.userId 
    });
    
    if (!review) {
      return apiError("NOT_FOUND", "Review not found or not owned by you", 404);
    }
    
    return apiSuccess({ message: "Review deleted successfully" });
    
  } catch (error) {
    console.error("Delete review error:", error);
    return apiError("SERVER_ERROR", "Failed to delete review", 500);
  }
}
