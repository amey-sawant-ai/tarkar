import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import connectToDatabase from "../lib/mongodb";
import { Dish } from "../models/Dish";

async function run() {
    await connectToDatabase();

    const dishes = await Dish.find({});
    const toRemove = dishes.filter(d => {
        // If it doesn't have an image starting with /photos/ and doesn't have a valid web URL, mark for removal
        const hasLocalImage = d.imageUrl && d.imageUrl.startsWith("/photos/");
        const hasWebImage = d.imageUrl && (d.imageUrl.startsWith("http://") || d.imageUrl.startsWith("https://"));

        return !hasLocalImage && !hasWebImage;
    });

    console.log(`Found ${toRemove.length} dishes with no valid image:`);
    toRemove.forEach(d => console.log(`- ${d.name} (ID: ${d._id}, Image: ${d.imageUrl})`));

    if (toRemove.length > 0) {
        console.log(`\nDeleting ${toRemove.length} dishes...`);
        const result = await Dish.deleteMany({
            _id: { $in: toRemove.map(d => d._id) }
        });
        console.log(`✅ Successfully deleted ${result.deletedCount} dishes.`);
    } else {
        console.log("\nNo dishes found to remove.");
    }

    process.exit(0);
}
run();
