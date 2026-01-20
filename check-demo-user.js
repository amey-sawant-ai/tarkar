import connectToDatabase from "./lib/mongodb";
import { User } from "./models/User";
import { Favorite } from "./models/Favorite";

async function checkDemoUser() {
  try {
    await connectToDatabase();
    
    const demoUser = await User.findOne({ email: "demo@tarkari.com" });
    if (demoUser) {
      console.log("Demo user ID:", demoUser._id.toString());
      
      // Check favorites for this user
      const favorites = await Favorite.find({ userId: demoUser._id.toString() });
      console.log("Favorites count:", favorites.length);
      
      if (favorites.length > 0) {
        console.log("Sample favorite:", favorites[0]);
      }
    } else {
      console.log("Demo user not found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

checkDemoUser();