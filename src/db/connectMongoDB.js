import mongoose from "mongoose";

import { Note } from "../models/note.js";
export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined");
    }

    await mongoose.connect(mongoUrl);

    await Note.syncIndexes();
    console.log("Indexes synced successfully");

    console.log("✅ MongoDB connection established successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};
