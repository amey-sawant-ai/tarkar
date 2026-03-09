import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import connectToDatabase from "../lib/mongodb";
import { Dish } from "../models/Dish";
import { Category } from "../models/Category";
import fs from "fs";
import path from "path";

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");

function normalize(str: string) {
    return str.toLowerCase().trim().replace(/[\s-_]+/g, " ");
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function updateDishImages() {
    try {
        await connectToDatabase();
        console.log("✅ Connected to MongoDB");

        if (!fs.existsSync(PHOTOS_DIR)) {
            console.error(`❌ Photos directory not found: ${PHOTOS_DIR}`);
            process.exit(1);
        }

        // Read all files from /public/photos
        const files = fs.readdirSync(PHOTOS_DIR);
        console.log(`📂 Found ${files.length} files in /public/photos`);

        // Build a map: normalized name → full filename
        const fileMap = new Map<string, string>();
        for (const file of files) {
            if (file.startsWith(".")) continue;
            const nameWithoutExt = path.parse(file).name;
            fileMap.set(normalize(nameWithoutExt), file);
        }

        const dishes = await Dish.find({});
        let matched = 0;
        let updated = 0;
        let unmatchedFiles = new Set(fileMap.keys());
        let unmatchedDishes: string[] = [];

        for (const dish of dishes) {
            const normalizedDishName = normalize(dish.name);
            const matchedFileName = fileMap.get(normalizedDishName);

            if (matchedFileName) {
                unmatchedFiles.delete(normalizedDishName);
                matched++;

                // Only update if it's not already an external URL
                if (!dish.imageUrl || (!dish.imageUrl.startsWith("http") && !dish.imageUrl.startsWith("https"))) {
                    const newUrl = `/photos/${matchedFileName}`;
                    if (dish.imageUrl !== newUrl) {
                        dish.imageUrl = newUrl;
                        await dish.save();
                        updated++;
                        console.log(`✅ Updated: "${dish.name}" → ${newUrl}`);
                    }
                } else {
                    console.log(`ℹ️  Skipped (external URL): "${dish.name}"`);
                }
            } else {
                unmatchedDishes.push(dish.name);
            }
        }

        console.log(`\n📊 Matching Summary:`);
        console.log(`   - Total Dishes in DB: ${dishes.length}`);
        console.log(`   - Matched: ${matched}`);
        console.log(`   - Updated in DB: ${updated}`);
        console.log(`   - Unmatched Dishes (${unmatchedDishes.length}):`);
        unmatchedDishes.forEach((name) => console.log(`      - ${name}`));

        // Handle photos with no corresponding dish
        if (unmatchedFiles.size > 0) {
            console.log(`\n🆕 Found ${unmatchedFiles.size} photos with no matching dish. Creating them...`);

            // Get or create "Uncategorized" category
            let uncategorized = await Category.findOne({ slug: "uncategorized" });
            if (!uncategorized) {
                // Find any existing category to use as fallback if "uncategorized" doesn't exist
                const anyCategory = await Category.findOne({});
                if (!anyCategory) {
                    console.error("❌ No categories found in database. Cannot create new dishes.");
                    process.exit(1);
                }

                // Try to create "Uncategorized"
                try {
                    uncategorized = await Category.create({
                        name: "Uncategorized",
                        slug: "uncategorized",
                        description: "Dishes waiting to be categorized",
                        isActive: true
                    });
                    console.log("📂 Created 'Uncategorized' category.");
                } catch (err) {
                    console.log("ℹ️  Could not create 'Uncategorized' category, using existing category instead.");
                    uncategorized = anyCategory;
                }
            }

            for (const normalizedName of unmatchedFiles) {
                const fileName = fileMap.get(normalizedName)!;
                const displayName = path.parse(fileName).name
                    .replace(/[-_]/g, " ")
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                const newDish = new Dish({
                    name: displayName,
                    slug: slugify(displayName),
                    categoryId: uncategorized!._id,
                    pricePaise: 0, // Placeholder
                    imageUrl: `/photos/${fileName}`,
                    isAvailable: true,
                    description: `Automatically created from photo: ${fileName}`
                });

                try {
                    await newDish.save();
                    console.log(`✨ Created new dish: "${displayName}"`);
                } catch (err: any) {
                    if (err.code === 11000) {
                        // Handle duplicate slug if it occurs
                        newDish.slug = `${newDish.slug}-${Math.floor(Math.random() * 1000)}`;
                        await newDish.save();
                        console.log(`✨ Created new dish (with random slug): "${displayName}"`);
                    } else {
                        console.error(`❌ Failed to create dish for "${fileName}":`, err.message);
                    }
                }
            }
        }

        console.log("\n✅ All done!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error running script:", error);
        process.exit(1);
    }
}

updateDishImages();
