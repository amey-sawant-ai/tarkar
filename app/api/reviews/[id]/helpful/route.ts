import connectToDatabase from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { apiSuccess, apiError, parseBody } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/reviews/[id]/helpful - Mark review as helpful
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const body = await parseBody<{ helpful: boolean }>(request);
    
    if (body === null || typeof body.helpful !== "boolean") {
      return apiError("BAD_REQUEST", "helpful field (boolean) is required", 400);
    }
    
    const update = body.helpful 
      ? { $inc: { helpfulCount: 1 } }
      : { $inc: { notHelpfulCount: 1 } };
    
    const review = await Review.findByIdAndUpdate(id, update, { new: true }).lean();
    
    if (!review) {
      return apiError("NOT_FOUND", "Review not found", 404);
    }
    
    return apiSuccess({
      helpfulCount: review.helpfulCount,
      notHelpfulCount: review.notHelpfulCount,
    });
    
  } catch (error) {
    console.error("Vote review error:", error);
    return apiError("SERVER_ERROR", "Failed to vote on review", 500);
  }
}
