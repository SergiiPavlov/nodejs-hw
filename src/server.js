import express from "express";
import cors from "cors";
import "dotenv/config";
import { errors } from "celebrate";

import { connectMongoDB } from "./db/connectMongoDB.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import notesRoutes from "./routes/notesRoutes.js";

const app = express();

const PORT = process.env.PORT ?? 3000;

// Global middleware
app.use(logger);
app.use(cors());
app.use(express.json());

// Test route to verify error handling (optional, but handy)
app.get("/test-error", (req, res, next) => {
  next(new Error("Test error"));
});

// Notes routes (paths defined inside the router, e.g. /notes, /notes/:noteId)
app.use(notesRoutes);

// 404 middleware (after all routes)
app.use(notFoundHandler);

// Celebrate validation errors middleware
app.use(errors());

// Error-handling middleware (last)
app.use(errorHandler);

// Connect to MongoDB and start server
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
