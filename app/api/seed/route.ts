import connectToDatabase from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { Dish } from "@/models/Dish";
import { User } from "@/models/User";
import { apiSuccess, apiError } from "@/lib/api-helpers";
import bcrypt from "bcryptjs";

// POST /api/seed - Seed the database with initial data (dev only)
export async function POST() {
  // Only allow in development mode
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_DEMO_MODE !== "true") {
    return apiError("FORBIDDEN", "Seeding is disabled in production", 403);
  }
  
  try {
    await connectToDatabase();

    const categories = [
      { name: "Starters", slug: "starters", description: "Delicious appetizers", displayOrder: 1 },
      { name: "Main Course", slug: "main-course", description: "Hearty main dishes", displayOrder: 2 },
      { name: "Breads", slug: "breads", description: "Fresh baked breads", displayOrder: 3 },
      { name: "Rice & Biryani", slug: "rice-biryani", description: "Aromatic rice dishes", displayOrder: 4 },
      { name: "Desserts", slug: "desserts", description: "Sweet endings", displayOrder: 5 },
      { name: "Beverages", slug: "beverages", description: "Refreshing drinks", displayOrder: 6 },
    ];

    // Clear and insert categories
    await Category.deleteMany({});
    const insertedCategories = await Category.insertMany(categories);
    
    const categoryMap = insertedCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat._id;
      return acc;
    }, {} as Record<string, string>);

    // Sample dishes
    const dishes = [
      { name: "Paneer Tikka", slug: "paneer-tikka", pricePaise: 29900, isVeg: true, isFeatured: true, isPopular: true, categoryId: categoryMap["starters"] },
      { name: "Samosa", slug: "samosa", pricePaise: 9900, isVeg: true, isPopular: true, categoryId: categoryMap["starters"] },
      { name: "Butter Chicken", slug: "butter-chicken", pricePaise: 39900, isVeg: false, isFeatured: true, isPopular: true, categoryId: categoryMap["main-course"] },
      { name: "Dal Makhani", slug: "dal-makhani", pricePaise: 27900, isVeg: true, isFeatured: true, isPopular: true, categoryId: categoryMap["main-course"] },
      { name: "Palak Paneer", slug: "palak-paneer", pricePaise: 28900, isVeg: true, isPopular: true, categoryId: categoryMap["main-course"] },
      { name: "Butter Naan", slug: "butter-naan", pricePaise: 6900, isVeg: true, isPopular: true, categoryId: categoryMap["breads"] },
      { name: "Garlic Naan", slug: "garlic-naan", pricePaise: 7900, isVeg: true, categoryId: categoryMap["breads"] },
      { name: "Chicken Biryani", slug: "chicken-biryani", pricePaise: 34900, isVeg: false, isFeatured: true, isPopular: true, categoryId: categoryMap["rice-biryani"] },
      { name: "Vegetable Biryani", slug: "veg-biryani", pricePaise: 27900, isVeg: true, categoryId: categoryMap["rice-biryani"] },
      { name: "Gulab Jamun", slug: "gulab-jamun", pricePaise: 12900, isVeg: true, isFeatured: true, isPopular: true, categoryId: categoryMap["desserts"] },
      { name: "Mango Lassi", slug: "mango-lassi", pricePaise: 12900, isVeg: true, isFeatured: true, isPopular: true, categoryId: categoryMap["beverages"] },
    ];

    await Dish.deleteMany({});
    const insertedDishes = await Dish.insertMany(dishes);

    // Create demo user
    const hashedPassword = await bcrypt.hash("password", 12);
    await User.findOneAndUpdate(
      { _id: "demo_user_001" },
      {
        email: "demo@tarkari.com",
        password: hashedPassword,
        name: "Demo User",
        phone: "+91 98765 43210",
        walletBalancePaise: 100000,
        preferences: { darkMode: false, language: "en" },
        notifications: { orderUpdates: true, promotions: true, newsletter: false, sms: true },
      },
      { upsert: true }
    );

    return apiSuccess({
      message: "Database seeded successfully",
      categories: insertedCategories.length,
      dishes: insertedDishes.length,
    });

  } catch (error) {
    console.error("Seed error:", error);
    return apiError("SERVER_ERROR", "Failed to seed database", 500);
  }
}
