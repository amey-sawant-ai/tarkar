import connectToDatabase from "../lib/mongodb";
import { Favorite } from "../models/Favorite";
import { User } from "../models/User";
import { Dish } from "../models/Dish";

async function seedFavorites() {
  try {
    console.log("🌱 Starting favorites seeding...");

    await connectToDatabase();
    console.log("✅ Connected to database");

    // Find demo user
    const demoUser = await User.findOne({ email: "demo@tarkari.com" });
    if (!demoUser) {
      console.log("❌ Demo user not found. Please create demo user first.");
      return;
    }

    console.log(`📧 Found demo user: ${demoUser.email}`);

    // Get some dishes to add as favorites
    const dishes = await Dish.find().limit(8);
    if (dishes.length === 0) {
      console.log("❌ No dishes found. Please seed dishes first.");
      return;
    }

    console.log(`🍽️ Found ${dishes.length} dishes to use as favorites`);

    // Clear existing favorites for demo user
    await Favorite.deleteMany({ userId: demoUser._id.toString() });
    console.log("🗑️ Cleared existing demo favorites");

    // Select 5 dishes randomly as favorites
    const selectedDishes = dishes.slice(0, 5);
    
    const favoritesToCreate = selectedDishes.map(dish => ({
      userId: demoUser._id.toString(),
      dishId: dish._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Favorite.insertMany(favoritesToCreate);
    console.log(`✅ Created ${favoritesToCreate.length} favorite dishes for demo user`);

    // Display the favorited dishes
    console.log("❤️ Favorited dishes:");
    selectedDishes.forEach((dish, index) => {
      console.log(`   ${index + 1}. ${dish.name} (₹${(dish.pricePaise / 100).toFixed(2)})`);
    });

    console.log("🎉 Favorites seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding favorites:", error);
    process.exit(1);
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedFavorites().then(() => {
    console.log("🏁 Favorites seeding process finished");
    process.exit(0);
  });
}

export default seedFavorites;