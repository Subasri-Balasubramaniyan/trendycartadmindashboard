// config/seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config(); // Load environment variables from .env

const seedAdmin = async () => {
  try {
    // Connect to MongoDB using URI from .env
    await mongoose.connect(process.env.MONGO_URI);

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
    } else {
      // Create new admin user
      const admin = new User({
        first_name: "Admin",
        last_name: "User",
        email: "admin@example.com", // ✅ Changed email here
        password: "admin123",       // ✅ Will be hashed if you have pre-save bcrypt hook in userModel
        role: "admin",
      });

      await admin.save();
      console.log("✅ Admin user seeded successfully!");
    }

    // Close DB and exit process
    await mongoose.connection.close();
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();
