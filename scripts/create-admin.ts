/**
 * Create admin user
 */
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  phone: String,
  role: { type: String, enum: ["user", "admin", "staff"], default: "user" },
  isActive: { type: Boolean, default: true },
  walletBalancePaise: { type: Number, default: 0 },
  preferences: {
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: "en" },
  },
  notifications: {
    orderUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false },
    sms: { type: Boolean, default: true },
  },
}, { timestamps: true });

async function createAdmin() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "tarkari",
    });
    console.log("✅ Connected to MongoDB");

    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const email = "admin@admin.com";
    const password = "admin@123A";
    const name = "Admin";

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("ℹ️  User already exists. Updating to admin...");
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        { _id: existingUser._id },
        { $set: { role: "admin", password: hashedPassword, isActive: true } }
      );
      console.log("✅ User updated to admin!");
    } else {
      console.log("📝 Creating new admin user...");
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashedPassword,
        name,
        role: "admin",
        isActive: true,
        walletBalancePaise: 0,
      });
      console.log("✅ Admin user created!");
    }

    console.log("\n📋 Admin credentials:");
    console.log("   Email: admin@admin.com");
    console.log("   Password: admin@123A");

    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createAdmin();
