/**
 * Script to promote a user to admin role
 * Usage: npx tsx scripts/make-admin.ts <email>
 * Example: npx tsx scripts/make-admin.ts demo@tarkari.com
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load env vars BEFORE any other imports
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

// Minimal User schema for this script
const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: { type: String, enum: ["user", "admin", "staff"], default: "user" },
  isActive: { type: Boolean, default: true },
});

async function makeAdmin(email: string) {
  try {
    console.log(`🔗 Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "tarkari",
    });
    console.log(`✅ Connected to MongoDB`);

    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`ℹ️  User "${user.name || email}" is already an admin`);
    } else {
      // Update user role to admin
      await User.updateOne(
        { _id: user._id },
        { $set: { role: "admin" } }
      );
      console.log(`✅ User "${user.name || email}" has been promoted to admin!`);
    }

    // Show current user info
    const updatedUser = await User.findById(user._id).select("email name role isActive");
    console.log(`\n📋 User details:`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Name: ${updatedUser.name || "(not set)"}`);
    console.log(`   Role: ${updatedUser.role || "user"}`);
    console.log(`   Active: ${updatedUser.isActive !== false}`);

    await mongoose.disconnect();
    console.log(`\n🔌 Disconnected from MongoDB`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.log(`
📋 Make Admin Script
====================
Usage: npx tsx scripts/make-admin.ts <email>

Examples:
  npx tsx scripts/make-admin.ts demo@tarkari.com
  npx tsx scripts/make-admin.ts admin@example.com
`);
  process.exit(1);
}

makeAdmin(email);
