import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import connectToDatabase from "@/lib/mongodb";
import { Category, Dish, User } from "@/models";
import bcrypt from "bcryptjs";

const categories = [
  { name: "Starters", slug: "starters", description: "Delicious appetizers to begin your meal", displayOrder: 1 },
  { name: "Main Course", slug: "main-course", description: "Hearty main dishes", displayOrder: 2 },
  { name: "Breads", slug: "breads", description: "Fresh baked Indian breads", displayOrder: 3 },
  { name: "Rice & Biryani", slug: "rice-biryani", description: "Aromatic rice dishes", displayOrder: 4 },
  { name: "Desserts", slug: "desserts", description: "Sweet endings", displayOrder: 5 },
  { name: "Beverages", slug: "beverages", description: "Refreshing drinks", displayOrder: 6 },
];

const dishes = [
  // Starters
  {
    name: "Paneer Tikka",
    slug: "paneer-tikka",
    description: "Marinated cottage cheese cubes grilled to perfection in tandoor",
    shortDescription: "Grilled cottage cheese",
    pricePaise: 29900,
    isVeg: true,
    isSpicy: false,
    spicyLevel: 2,
    preparationTime: 20,
    isFeatured: true,
    isPopular: true,
    tags: ["paneer", "tikka", "starter", "vegetarian"],
    category: "starters",
  },
  {
    name: "Samosa",
    slug: "samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    shortDescription: "Crispy potato pastry",
    pricePaise: 9900,
    isVeg: true,
    isSpicy: true,
    spicyLevel: 2,
    preparationTime: 15,
    isPopular: true,
    tags: ["samosa", "starter", "snack"],
    category: "starters",
  },
  {
    name: "Chicken Tikka",
    slug: "chicken-tikka",
    description: "Tender chicken pieces marinated in yogurt and spices, grilled in tandoor",
    shortDescription: "Grilled spiced chicken",
    pricePaise: 34900,
    isVeg: false,
    isSpicy: true,
    spicyLevel: 3,
    preparationTime: 25,
    isFeatured: true,
    tags: ["chicken", "tikka", "starter", "non-veg"],
    category: "starters",
  },
  // Main Course
  {
    name: "Butter Chicken",
    slug: "butter-chicken",
    description: "Tender chicken in rich, creamy tomato-based curry",
    shortDescription: "Creamy tomato chicken",
    pricePaise: 39900,
    isVeg: false,
    isSpicy: false,
    spicyLevel: 1,
    preparationTime: 30,
    isFeatured: true,
    isPopular: true,
    tags: ["butter chicken", "chicken", "curry", "popular"],
    category: "main-course",
  },
  {
    name: "Dal Makhani",
    slug: "dal-makhani",
    description: "Black lentils slow-cooked with butter and cream",
    shortDescription: "Creamy black lentils",
    pricePaise: 27900,
    isVeg: true,
    isSpicy: false,
    spicyLevel: 1,
    preparationTime: 25,
    isFeatured: true,
    isPopular: true,
    tags: ["dal", "lentils", "vegetarian", "creamy"],
    category: "main-course",
  },
  {
    name: "Palak Paneer",
    slug: "palak-paneer",
    description: "Cottage cheese cubes in creamy spinach gravy",
    shortDescription: "Spinach with cottage cheese",
    pricePaise: 28900,
    isVeg: true,
    isSpicy: false,
    spicyLevel: 1,
    preparationTime: 25,
    isPopular: true,
    tags: ["paneer", "palak", "spinach", "vegetarian"],
    category: "main-course",
  },
  {
    name: "Rogan Josh",
    slug: "rogan-josh",
    description: "Aromatic lamb curry from Kashmir with bold spices",
    shortDescription: "Kashmiri lamb curry",
    pricePaise: 44900,
    isVeg: false,
    isSpicy: true,
    spicyLevel: 3,
    preparationTime: 40,
    isFeatured: true,
    tags: ["lamb", "rogan josh", "kashmiri", "spicy"],
    category: "main-course",
  },
  // Breads
  {
    name: "Butter Naan",
    slug: "butter-naan",
    description: "Soft leavened bread brushed with butter",
    shortDescription: "Buttery Indian bread",
    pricePaise: 6900,
    isVeg: true,
    preparationTime: 10,
    isPopular: true,
    tags: ["naan", "bread", "butter"],
    category: "breads",
  },
  {
    name: "Garlic Naan",
    slug: "garlic-naan",
    description: "Naan topped with garlic and cilantro",
    shortDescription: "Garlic flavored bread",
    pricePaise: 7900,
    isVeg: true,
    preparationTime: 10,
    isPopular: true,
    tags: ["naan", "bread", "garlic"],
    category: "breads",
  },
  {
    name: "Tandoori Roti",
    slug: "tandoori-roti",
    description: "Whole wheat bread baked in tandoor",
    shortDescription: "Whole wheat tandoor bread",
    pricePaise: 4900,
    isVeg: true,
    preparationTime: 8,
    tags: ["roti", "bread", "healthy"],
    category: "breads",
  },
  // Rice & Biryani
  {
    name: "Chicken Biryani",
    slug: "chicken-biryani",
    description: "Fragrant basmati rice layered with spiced chicken",
    shortDescription: "Aromatic chicken rice",
    pricePaise: 34900,
    isVeg: false,
    isSpicy: true,
    spicyLevel: 2,
    preparationTime: 35,
    isFeatured: true,
    isPopular: true,
    tags: ["biryani", "chicken", "rice", "popular"],
    category: "rice-biryani",
  },
  {
    name: "Vegetable Biryani",
    slug: "vegetable-biryani",
    description: "Aromatic basmati rice with mixed vegetables and spices",
    shortDescription: "Vegetable spiced rice",
    pricePaise: 27900,
    isVeg: true,
    isSpicy: false,
    spicyLevel: 2,
    preparationTime: 30,
    tags: ["biryani", "vegetable", "rice", "vegetarian"],
    category: "rice-biryani",
  },
  {
    name: "Jeera Rice",
    slug: "jeera-rice",
    description: "Basmati rice tempered with cumin seeds",
    shortDescription: "Cumin flavored rice",
    pricePaise: 17900,
    isVeg: true,
    preparationTime: 15,
    tags: ["rice", "jeera", "cumin"],
    category: "rice-biryani",
  },
  // Desserts
  {
    name: "Gulab Jamun",
    slug: "gulab-jamun",
    description: "Deep-fried milk dumplings soaked in rose-flavored syrup",
    shortDescription: "Sweet milk dumplings",
    pricePaise: 12900,
    isVeg: true,
    preparationTime: 10,
    isFeatured: true,
    isPopular: true,
    tags: ["dessert", "sweet", "gulab jamun"],
    category: "desserts",
  },
  {
    name: "Rasmalai",
    slug: "rasmalai",
    description: "Soft cottage cheese patties in creamy saffron milk",
    shortDescription: "Creamy cottage cheese dessert",
    pricePaise: 14900,
    isVeg: true,
    preparationTime: 10,
    isPopular: true,
    tags: ["dessert", "sweet", "rasmalai", "saffron"],
    category: "desserts",
  },
  {
    name: "Kheer",
    slug: "kheer",
    description: "Traditional Indian rice pudding with nuts and saffron",
    shortDescription: "Rice pudding",
    pricePaise: 11900,
    isVeg: true,
    preparationTime: 10,
    tags: ["dessert", "sweet", "kheer", "rice pudding"],
    category: "desserts",
  },
  // Beverages
  {
    name: "Mango Lassi",
    slug: "mango-lassi",
    description: "Creamy yogurt drink blended with fresh mango",
    shortDescription: "Mango yogurt drink",
    pricePaise: 12900,
    isVeg: true,
    preparationTime: 5,
    isFeatured: true,
    isPopular: true,
    tags: ["lassi", "mango", "drink", "beverage"],
    category: "beverages",
  },
  {
    name: "Sweet Lassi",
    slug: "sweet-lassi",
    description: "Traditional sweet yogurt drink",
    shortDescription: "Sweet yogurt drink",
    pricePaise: 9900,
    isVeg: true,
    preparationTime: 5,
    tags: ["lassi", "drink", "beverage"],
    category: "beverages",
  },
  {
    name: "Masala Chai",
    slug: "masala-chai",
    description: "Spiced Indian tea with milk",
    shortDescription: "Spiced Indian tea",
    pricePaise: 6900,
    isVeg: true,
    preparationTime: 5,
    isPopular: true,
    tags: ["chai", "tea", "drink", "beverage"],
    category: "beverages",
  },
];

export async function seedDatabase() {
  try {
    await connectToDatabase();
    console.log("Connected to database");

    // Clear existing data
    await Category.deleteMany({});
    await Dish.deleteMany({});
    console.log("Cleared existing data");

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`Inserted ${insertedCategories.length} categories`);

    // Create category slug to ID map
    const categoryMap = insertedCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat._id;
      return acc;
    }, {} as Record<string, string>);

    // Insert dishes with category IDs
    const dishesWithCategoryIds = dishes.map((dish) => ({
      ...dish,
      categoryId: categoryMap[dish.category],
      category: undefined,
    }));

    const insertedDishes = await Dish.insertMany(dishesWithCategoryIds);
    console.log(`Inserted ${insertedDishes.length} dishes`);

    // Create demo user if not exists
    const demoUser = await User.findOne({ email: "demo@tarkari.com" });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash("password", 12);
      await User.create({
        email: "demo@tarkari.com",
        password: hashedPassword,
        name: "Demo User",
        phone: "+91 98765 43210",
        walletBalancePaise: 100000, // ₹1000
        preferences: { darkMode: false, language: "en" },
        notifications: { orderUpdates: true, promotions: true, newsletter: false, sms: true },
      });
      console.log("Created demo user");
    }

    console.log("Database seeded successfully!");
    return { success: true };
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
}

// Run directly if called from command line
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
