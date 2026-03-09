import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import connectToDatabase from "../lib/mongodb";
import { Dish } from "../models/Dish";
import fs from "fs";
import path from "path";

async function run() {
    await connectToDatabase();
    const count = await Dish.countDocuments({});
    const files = fs.readdirSync(path.join(process.cwd(), "public", "photos")).filter(f => !f.startsWith("."));

    console.log("Database Dish Count:", count);
    console.log("Photos File Count:", files.length);

    process.exit(0);
}
run();
