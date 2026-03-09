import connectToDatabase from "@/lib/mongodb";
import { Dish } from "@/models/Dish";
import { Category } from "@/models/Category";
import { apiSuccess, apiError, getPagination, paginatedResponse } from "@/lib/api-helpers";

// GET /api/menu/search - Search dishes and categories
export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPagination(request);

    const query = searchParams.get("q")?.trim();
    if (!query || query.length < 2) {
      return apiError("VALIDATION_ERROR", "Search query must be at least 2 characters", 400);
    }

    // Build search criteria
    const searchRegex = new RegExp(query, "i");
    const dishQuery: any = {
      $and: [
        { isAvailable: true },
        {
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { shortDescription: searchRegex },
            { tags: { $in: [searchRegex] } },
          ],
        },
      ],
    };

    // Filter by category if provided
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug }).lean();
      if (category) {
        dishQuery.$and.push({ categoryId: category._id });
      }
    }

    // Filter by dietary preferences
    const isVeg = searchParams.get("isVeg");
    if (isVeg === "true") {
      dishQuery.$and.push({ isVeg: true });
    }

    const isVegan = searchParams.get("isVegan");
    if (isVegan === "true") {
      dishQuery.$and.push({ isVegan: true });
    }

    const isSpicy = searchParams.get("isSpicy");
    if (isSpicy === "true") {
      dishQuery.$and.push({ isSpicy: true });
    }

    // Price range filter
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      const priceFilter: any = {};
      if (minPrice) priceFilter.$gte = parseInt(minPrice, 10) * 100; // Convert to paise
      if (maxPrice) priceFilter.$lte = parseInt(maxPrice, 10) * 100; // Convert to paise
      dishQuery.$and.push({ pricePaise: priceFilter });
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "relevance";
    let sortCriteria: any;

    switch (sortBy) {
      case "price-low":
        sortCriteria = { pricePaise: 1 };
        break;
      case "price-high":
        sortCriteria = { pricePaise: -1 };
        break;
      case "rating":
        sortCriteria = { avgRating: -1, totalReviews: -1 };
        break;
      case "popular":
        sortCriteria = { isPopular: -1, totalOrders: -1 };
        break;
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      default: // relevance
        sortCriteria = { isFeatured: -1, isPopular: -1, avgRating: -1 };
    }

    // Execute search
    const [total, dishes] = await Promise.all([
      Dish.countDocuments(dishQuery),
      Dish.find(dishQuery)
        .sort(sortCriteria)
        .skip(skip)
        .limit(pageSize)
        .populate("categoryId", "name slug")
        .lean(),
    ]);

    // Also search categories for broader results
    const categoryQuery = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: searchRegex },
            { description: searchRegex },
          ],
        },
      ],
    };

    const categories = page === 1 ? await Category.find(categoryQuery)
      .sort({ displayOrder: 1 })
      .limit(5)
      .lean() : [];

    return apiSuccess({
      dishes,
      categories: page === 1 ? categories : [],
      query,
      filters: {
        category: categorySlug,
        isVeg: isVeg === "true",
        isVegan: isVegan === "true",
        isSpicy: isSpicy === "true",
        minPrice: minPrice ? parseInt(minPrice, 10) : null,
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : null,
        sortBy,
      },
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });

  } catch (error) {
    console.error("Search error:", error);
    return apiError("SERVER_ERROR", "Failed to search", 500);
  }
}