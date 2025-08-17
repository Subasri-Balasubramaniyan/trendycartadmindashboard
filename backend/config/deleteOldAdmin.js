// config/deleteOldAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const deleteOldAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await User.deleteOne({ email: "admin@trendycart.com" });

    if (result.deletedCount > 0) {
      console.log("✅ Old admin deleted.");
    } else {
      console.log("ℹ️ No admin with that email found.");
    }

    await mongoose.connection.close();
    process.exit();
  } catch (err) {
    console.error("❌ Failed to delete admin:", err.message);
    process.exit(1);
  }
};

deleteOldAdmin();
