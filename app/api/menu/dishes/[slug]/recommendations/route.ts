import connectToDatabase from "@/lib/mongodb";
import { Dish } from "@/models/Dish";
import { Order } from "@/models/Order";
import { Favorite } from "@/models/Favorite";
import { apiSuccess, apiError, getOptionalUserId } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/menu/dishes/[slug]/recommendations - Get recommendations for a dish
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    const { slug } = await params;
    const userId = getOptionalUserId(request);
    
    // Get the current dish
    const currentDish = await Dish.findOne({ slug, isAvailable: true }).lean();
    if (!currentDish) {
      return apiError("NOT_FOUND", "Dish not found", 404);
    }
    
    const { searchParams } = new URL(request.url);
    const limit = Math.min(12, parseInt(searchParams.get("limit") || "6", 10));
    
    let recommendations: any[] = [];
    
    // Strategy 1: If user is logged in, get personalized recommendations
    if (userId) {
      // Get dishes from user's favorite categories
      const userFavorites = await Favorite.find({ userId })
        .populate("dishId")
        .lean();
      
      const favoriteCategories = [...new Set(
        userFavorites
          .map(f => f.dishId?.categoryId?.toString())
          .filter(Boolean)
      )];
      
      if (favoriteCategories.length > 0) {
        const categoryRecommendations = await Dish.find({
          categoryId: { $in: favoriteCategories },
          _id: { $ne: currentDish._id },
          isAvailable: true,
        })
          .sort({ avgRating: -1, totalReviews: -1 })
          .limit(Math.ceil(limit / 2))
          .populate("categoryId", "name slug")
          .lean();
        
        recommendations.push(...categoryRecommendations);
      }
      
      // Get dishes frequently ordered together
      const userOrders = await Order.find({ 
        userId,
        "items.itemId": currentDish._id.toString(),
      })
        .lean();
      
      const coOrderedDishIds = userOrders
        .flatMap(order => order.items)
        .filter(item => item.itemId !== currentDish._id.toString())
        .map(item => item.itemId);
      
      const frequentlyTogether = await Dish.find({
        _id: { $in: [...new Set(coOrderedDishIds)] },
        isAvailable: true,
      })
        .sort({ avgRating: -1 })
        .limit(Math.ceil(limit / 3))
        .populate("categoryId", "name slug")
        .lean();
      
      recommendations.push(...frequentlyTogether);
    }
    
    // Strategy 2: Category-based recommendations
    const categoryRecommendations = await Dish.find({
      categoryId: currentDish.categoryId,
      _id: { $ne: currentDish._id },
      isAvailable: true,
    })
      .sort({ isFeatured: -1, avgRating: -1, totalReviews: -1 })
      .limit(4)
      .populate("categoryId", "name slug")
      .lean();
    
    recommendations.push(...categoryRecommendations);
    
    // Strategy 3: Similar price range
    const priceRange = {
      min: Math.max(0, currentDish.pricePaise - 5000), // ±₹50
      max: currentDish.pricePaise + 5000,
    };
    
    const similarPrice = await Dish.find({
      pricePaise: { $gte: priceRange.min, $lte: priceRange.max },
      _id: { $ne: currentDish._id },
      isAvailable: true,
    })
      .sort({ avgRating: -1, isPopular: -1 })
      .limit(3)
      .populate("categoryId", "name slug")
      .lean();
    
    recommendations.push(...similarPrice);
    
    // Strategy 4: Same dietary preferences
    if (currentDish.isVeg || currentDish.isVegan) {
      const dietaryFilter: any = { 
        _id: { $ne: currentDish._id },
        isAvailable: true,
      };
      
      if (currentDish.isVegan) {
        dietaryFilter.isVegan = true;
      } else if (currentDish.isVeg) {
        dietaryFilter.isVeg = true;
      }
      
      const dietarySimilar = await Dish.find(dietaryFilter)
        .sort({ avgRating: -1, totalReviews: -1 })
        .limit(3)
        .populate("categoryId", "name slug")
        .lean();
      
      recommendations.push(...dietarySimilar);
    }
    
    // Strategy 5: Popular dishes as fallback
    const popular = await Dish.find({
      isPopular: true,
      _id: { $ne: currentDish._id },
      isAvailable: true,
    })
      .sort({ totalOrders: -1, avgRating: -1 })
      .limit(4)
      .populate("categoryId", "name slug")
      .lean();
    
    recommendations.push(...popular);
    
    // Remove duplicates and limit results
    const uniqueRecommendations = recommendations
      .filter((dish, index, self) => 
        index === self.findIndex(d => d._id.toString() === dish._id.toString())
      )
      .slice(0, limit);
    
    return apiSuccess({
      dish: currentDish,
      recommendations: uniqueRecommendations,
      strategies: {
        personalized: userId ? true : false,
        category: categoryRecommendations.length > 0,
        priceRange: similarPrice.length > 0,
        dietary: currentDish.isVeg || currentDish.isVegan,
        popular: popular.length > 0,
      },
    });
    
  } catch (error) {
    console.error("Get recommendations error:", error);
    return apiError("SERVER_ERROR", "Failed to get recommendations", 500);
  }
}