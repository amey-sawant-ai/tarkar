import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import connectToDatabase from "./lib/mongodb";
import mongoose from "mongoose";

async function run() {
    await connectToDatabase();
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    const Dish = mongoose.model("Dish");
    const count = await Dish.countDocuments({});
    console.log("Dish Count:", count);

    const sample = await Dish.find({}).limit(5);
    console.log("Sample Dishes:", JSON.stringify(sample, null, 2));

    process.exit(0);
}
run();
