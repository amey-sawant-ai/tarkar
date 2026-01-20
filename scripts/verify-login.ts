/**
 * Verify demo user login
 */
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
});

async function verifyLogin() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "tarkari",
    });

    const User = mongoose.models.User || mongoose.model("User", UserSchema);
    const user = await User.findOne({ email: "demo@tarkari.com" });

    if (!user) {
      console.log("❌ Demo user not found!");
      process.exit(1);
    }

    console.log("✅ User found:");
    console.log("   Email:", user.email);
    console.log("   Name:", user.name);
    console.log("   Role:", user.role);
    console.log("   Password hash:", user.password?.substring(0, 30) + "...");

    // Try to verify password
    const testPassword = "password";
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log("\n🔐 Password 'password' valid:", isValid);

    if (!isValid) {
      console.log("\n⚠️  Password doesn't match. Resetting password to 'password'...");
      const newHash = await bcrypt.hash("password", 10);
      await User.updateOne({ _id: user._id }, { $set: { password: newHash } });
      console.log("✅ Password reset successfully!");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyLogin();
