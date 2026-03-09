import connectToDatabase from "@/lib/mongodb";
import { Dish } from "@/models/Dish";
import { Category } from "@/models/Category"; // Required for populate
import { apiError, getPagination, paginatedResponse, apiSuccess, parseBody, validateRequired } from "@/lib/api-helpers";

interface DishBody {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId: string;
  pricePaise: number;
  isVeg?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  spicyLevel?: number;
  servingSize?: string;
  preparationTime?: number;
  imageUrl?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
}

// GET /api/menu/dishes - Get dishes with filters
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    // Ensure Category model is registered for populate
    void Category;

    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPagination(request);

    // Build query filters
    const query: Record<string, unknown> = {};

    // Include all dishes by default, but allow filtering by availability
    const includeUnavailable = searchParams.get("includeUnavailable");
    if (!includeUnavailable || includeUnavailable !== "true") {
      query.isAvailable = true;
    }

    // Category filter
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      query.categoryId = categoryId;
    }

    // Veg/Non-veg filter
    const isVeg = searchParams.get("isVeg");
    if (isVeg !== null) {
      query.isVeg = isVeg === "true";
    }

    // Vegan filter
    const isVegan = searchParams.get("isVegan");
    if (isVegan === "true") {
      query.isVegan = true;
    }

    // Gluten free filter
    const isGlutenFree = searchParams.get("isGlutenFree");
    if (isGlutenFree === "true") {
      query.isGlutenFree = true;
    }

    // Spicy filter
    const isSpicy = searchParams.get("isSpicy");
    if (isSpicy === "true") {
      query.isSpicy = true;
    }

    // Featured filter
    const isFeatured = searchParams.get("featured");
    if (isFeatured === "true") {
      query.isFeatured = true;
    }

    // Popular filter
    const isPopular = searchParams.get("popular");
    if (isPopular === "true") {
      query.isPopular = true;
    }

    // Price range filter
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      query.pricePaise = {};
      if (minPrice) (query.pricePaise as Record<string, number>).$gte = parseInt(minPrice, 10) * 100;
      if (maxPrice) (query.pricePaise as Record<string, number>).$lte = parseInt(maxPrice, 10) * 100;
    }

    // Search
    const search = searchParams.get("search");
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "displayOrder";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    // Optimize: Only project fields needed for the menu listing
    const projection = {
      _id: 1,
      name: 1,
      shortDescription: 1,
      pricePaise: 1,
      imageUrl: 1,
      isVeg: 1,
      isSpicy: 1,
      spicyLevel: 1,
      isAvailable: 1,
      categoryId: 1,
      preparationTime: 1,
      displayOrder: 1,
    };

    const [total, dishes] = await Promise.all([
      Dish.countDocuments(query),
      Dish.find(query, projection)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .populate("categoryId", "name slug")
        .lean()
        .exec(),
    ]);

    // Create response with cache headers
    const response = paginatedResponse(dishes, total, page, pageSize);

    // Add cache headers - cache for 60 seconds, stale-while-revalidate for 5 minutes
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");

    return response;

  } catch (error) {
    console.error("Get dishes error:", error instanceof Error ? error.message : error);
    console.error("Full error:", error);
    return apiError("SERVER_ERROR", `Failed to get dishes: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}

// POST /api/menu/dishes - Create new dish
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await parseBody<DishBody>(request);
    const validation = validateRequired(body, ["name", "slug", "categoryId", "pricePaise"]);

    if (!validation.valid) {
      return apiError(
        "VALIDATION_ERROR",
        "Name, slug, categoryId, and pricePaise are required",
        400,
        validation.errors
      );
    }

    const {
      name,
      slug,
      description,
      shortDescription,
      categoryId,
      pricePaise,
      isVeg,
      isVegan,
      isSpicy,
      spicyLevel,
      servingSize,
      preparationTime,
      imageUrl,
      isFeatured,
      isAvailable,
    } = validation.data;

    // Check if dish already exists
    const existing = await Dish.findOne({ slug });
    if (existing) {
      return apiError("CONFLICT", "Dish with this slug already exists", 409);
    }

    // Create new dish
    const dish = await Dish.create({
      name,
      slug,
      description: description || "",
      shortDescription: shortDescription || "",
      categoryId,
      pricePaise,
      isVeg: isVeg !== false,
      isVegan: isVegan || false,
      isSpicy: isSpicy || false,
      spicyLevel: spicyLevel || 0,
      servingSize: servingSize || "",
      preparationTime: preparationTime || 0,
      imageUrl: imageUrl || "/Tarkari-image.png",
      isFeatured: isFeatured || false,
      isAvailable: isAvailable !== false,
    });

    return apiSuccess(dish, undefined, 201);
  } catch (error) {
    console.error("Create dish error:", error);
    return apiError("SERVER_ERROR", "Failed to create dish", 500);
  }
}
