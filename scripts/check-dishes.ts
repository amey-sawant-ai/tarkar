import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import connectToDatabase from "./lib/mongodb";
import { Dish } from "./models/Dish";

async function run() {
    await connectToDatabase();
    const newlyCreated = await Dish.find({ description: /Automatically created/ });
    console.log("Newly Created Dishes:");
    newlyCreated.forEach(d => console.log(`- ${d.name}`));

    const total = await Dish.countDocuments({});
    const withImages = await Dish.countDocuments({ imageUrl: { $exists: true, $ne: "" } });
    console.log(`\nTotal Dishes: ${total}`);
    console.log(`Dishes with images: ${withImages}`);

    process.exit(0);
}
run();
