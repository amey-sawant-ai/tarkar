/**
 * Migration script to update User collection schema to include password field
 * This drops the old collection and allows Mongoose to recreate it with the new schema
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB || "tarkari";

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(`${MONGODB_URI}/${MONGODB_DB}`);
    console.log("✓ Connected to MongoDB");

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not available");
    }

    // Drop the old users collection to recreate with new schema
    const collections = await db.listCollections().toArray();
    const userCollectionExists = collections.some((c) => c.name === "users");

    if (userCollectionExists) {
      console.log("Dropping old 'users' collection...");
      await db.dropCollection("users");
      console.log("✓ Dropped old 'users' collection");
    } else {
      console.log("✓ No existing 'users' collection found");
    }

    // The new schema will be created automatically on first insert
    console.log(
      "✓ Migration complete! New schema will be created on first user registration"
    );

    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrate();
