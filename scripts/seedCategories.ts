import connectToDatabase from "../lib/mongodb";
import { Category } from "../models/Category";

const categoriesData = [
  {
    name: "North Indian",
    slug: "north-indian",
    description: "Traditional North Indian cuisine with rich gravies and breads",
    displayOrder: 1,
    isActive: true,
  },
  {
    name: "South Indian",
    slug: "south-indian",
    description: "Authentic South Indian dishes - dosas, idlis, and more",
    displayOrder: 2,
    isActive: true,
  },
  {
    name: "Chinese",
    slug: "chinese",
    description: "Indo-Chinese fusion dishes with vegetarian options",
    displayOrder: 3,
    isActive: true,
  },
  {
    name: "Snacks",
    slug: "snacks",
    description: "Crispy and savory snacks perfect for any time",
    displayOrder: 4,
    isActive: true,
  },
  {
    name: "Beverages",
    slug: "beverages",
    description: "Hot and cold drinks to refresh you",
    displayOrder: 5,
    isActive: true,
  },
  {
    name: "Thali",
    slug: "thali",
    description: "Complete Indian meals with variety of dishes",
    displayOrder: 6,
    isActive: true,
  },
];

async function seedCategories() {
  try {
    await connectToDatabase();
    
    console.log("🌱 Starting category seed...");
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log("✓ Cleared existing categories");
    
    // Seed categories
    const result = await Category.insertMany(categoriesData);
    console.log(`✓ Seeded ${result.length} categories`);
    
    console.log("✅ Category seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seedCategories();
