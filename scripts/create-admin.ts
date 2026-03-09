import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await connectToDatabase();
    console.log("✅ Connected to MongoDB");

    const email = "admin@admin.com";
    const password = "admin@123A";
    const name = "Admin";

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("ℹ️  User already exists. Updating to admin...");
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            role: "admin",
            password: hashedPassword,
            isActive: true,
            isVerified: true
          }
        }
      );
      console.log("✅ User updated to admin!");
    } else {
      console.log("📝 Creating new admin user...");
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
        isActive: true,
        isVerified: true,
        walletBalancePaise: 0,
      });
      console.log("✅ Admin user created successfully");
    }

    console.log("\n📋 Admin credentials:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createAdmin();
