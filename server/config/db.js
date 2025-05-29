import mongoose from "mongoose";
import dotenv from "dotenv";
// import { watchProfileChanges } from "./watcher.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // watchProfileChanges();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
