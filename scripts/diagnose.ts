import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import connectToDatabase from "../lib/mongodb";
import { Dish } from "../models/Dish";
import fs from "fs";
import path from "path";

async function run() {
    await connectToDatabase();

    const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");
    const files = fs.readdirSync(PHOTOS_DIR).filter(f => !f.startsWith("."));
    const dishes = await Dish.find({});

    const autoCreated = dishes.filter(d => d.description?.includes("Automatically created"));
    const matchedWithLocal = dishes.filter(d => d.imageUrl?.startsWith("/photos/"));

    console.log("--- FINAL STATUS REPORT ---");
    console.log(`1. Files in /public/photos: ${files.length}`);
    console.log(`2. Total Dishes in Database: ${dishes.length}`);
    console.log(`3. Dishes with local images: ${matchedWithLocal.length}`);
    console.log(`4. Dishes marked as 'Automatically created': ${autoCreated.length}`);

    const unmappedPhotos = files.filter(file => {
        const url = `/photos/${file}`;
        return !matchedWithLocal.some(d => d.imageUrl === url);
    });

    console.log(`5. Photos NOT mapped to any dish: ${unmappedPhotos.length}`);
    if (unmappedPhotos.length > 0) {
        console.log("   Unmapped files:", unmappedPhotos.slice(0, 10).join(", "));
    }

    process.exit(0);
}
run();
