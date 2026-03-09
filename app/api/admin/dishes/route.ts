import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Dish, Category } from "@/models";
import { apiSuccess, apiError, requireAdmin, getPagination } from "@/lib/api-helpers";

// GET /api/admin/dishes - List all dishes with filters
export async function GET(request: NextRequest) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { page, pageSize, skip } = getPagination(request);
  const url = new URL(request.url);

  // Build filter
  const filter: Record<string, unknown> = {};

  const category = url.searchParams.get("category");
  if (category && category !== "all") {
    // Look up category by slug to get categoryId
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) {
      filter.categoryId = categoryDoc._id;
    }
  }

  const isAvailable = url.searchParams.get("isAvailable");
  if (isAvailable === "true") {
    filter.isAvailable = true;
  } else if (isAvailable === "false") {
    filter.isAvailable = false;
  }

  const search = url.searchParams.get("search");
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const [dishes, total] = await Promise.all([
      Dish.find(filter)
        .populate("categoryId", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Dish.countDocuments(filter),
    ]);

    return apiSuccess(dishes, {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return apiError("SERVER_ERROR", "Failed to fetch dishes", 500);
  }
}

// POST /api/admin/dishes - Create new dish
export async function POST(request: NextRequest) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  try {
    const body = await request.json();

    // Validate required fields
    const { name, description, pricePaise, category } = body;
    if (!name || !description || !pricePaise || !category) {
      return apiError("BAD_REQUEST", "Name, description, price, and category are required", 400);
    }

    // Look up category by slug to get categoryId
    const categoryDoc = await Category.findOne({ slug: category });
    if (!categoryDoc) {
      return apiError("NOT_FOUND", "Category not found", 404);
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug already exists
    const existingDish = await Dish.findOne({ slug });
    const finalSlug = existingDish ? `${slug}-${Date.now()}` : slug;

    const dish = await Dish.create({
      name,
      slug: finalSlug,
      description,
      pricePaise: parseInt(pricePaise, 10),
      categoryId: categoryDoc._id,
      imageUrl: body.image || "",
      isVeg: body.isVeg ?? true,
      isAvailable: body.isAvailable ?? true,
      isFeatured: body.isFeatured ?? false,
      spicyLevel: body.spiceLevel || 1,
      preparationTime: body.preparationTime || 20,
      ingredients: body.ingredients || [],
      allergens: body.allergens || [],
    });

    return apiSuccess(dish, undefined, 201);
  } catch (error) {
    console.error("Error creating dish:", error);
    return apiError("SERVER_ERROR", "Failed to create dish", 500);
  }
}
