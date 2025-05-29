import mongoose from "mongoose";
import Post from "../models/post.js";
import classifyText from "../services/classifyText.js";
import { config } from "dotenv";

config();

const workerConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 2,
      connectTimeoutMS: 30000,
    });
  } catch (err) {
    console.error("Worker DB connection failed:", err);
    process.exit(1);
  }
};

process.on("message", async ({ postId, text }) => {
  try {
    await workerConnect();

    const keywords = await classifyText(text);

    await Post.findByIdAndUpdate(
      postId,
      { keywords },
      {
        maxTimeMS: 30000,
      }
    );
  } catch (err) {
    console.error("Classification worker error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
});
