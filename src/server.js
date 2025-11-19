import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT ?? 3000;

// Middleware: JSON body parsing
app.use(express.json());

// Middleware: CORS
app.use(cors());

// Middleware: HTTP logger
app.use(
  pinoHttp({
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
        messageFormat: "{req.method} {req.url} {res.statusCode} - {responseTime}ms",
        hideObject: true
      }
    }
  })
);

// Routes
app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes"
  });
});

app.get("/notes/:noteId", (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`
  });
});

app.get("/test-error", () => {
  throw new Error("Simulated server error");
});

// 404 middleware (after all routes)
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// Error-handling middleware (last)
app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd
      ? "Something went wrong. Please try again later."
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
