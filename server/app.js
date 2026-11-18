const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const logger = require("./utils/logger");
const errorMiddleware = require("./middleware/errorMiddleware");
const noSqlSanitizer = require("./middleware/sanitizeMiddleware");
const { swaggerUi, specs } = require("./swagger");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const settingRoutes = require("./routes/settingRoutes");

const app = express();

app.set("trust proxy", 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(noSqlSanitizer);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Serve static uploads
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath, { maxAge: "30d" }));

// API Routes (v1 and aliases)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/inquiries", inquiryRoutes);
app.use("/api/v1/settings", settingRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/settings", settingRoutes);

// Health check endpoints (always available)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Sri Srinivasa Clean Rooms API",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};

app.get("/health", healthHandler);
app.get("/api/v1/health", healthHandler);
app.get("/api/health", healthHandler);

// Serve frontend dist if available (local development / monolithic preview)
const clientDistPath = path.join(__dirname, "../client/dist");
const rootDistPath = path.join(__dirname, "../dist");
const distPath = fs.existsSync(path.join(clientDistPath, "index.html"))
  ? clientDistPath
  : fs.existsSync(path.join(rootDistPath, "index.html"))
  ? rootDistPath
  : null;

if (distPath) {
  app.use(express.static(distPath));

  // Catch-all route to serve React index.html for client-side routing
  app.use((req, res, next) => {
    // If the request is for the API and wasn't caught by the API routes above,
    // let it fall through to the 404/error handler instead of serving HTML
    if (req.originalUrl.startsWith("/api/")) {
      return next();
    }
    const indexPath = path.join(distPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err && !res.headersSent) {
        res.status(200).json({
          success: true,
          service: "Sri Srinivasa Clean Rooms API",
          status: "healthy",
        });
      }
    });
  });
} else {
  // Backend-only mode (Render web service hosting API & uploads)
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      service: "Sri Srinivasa Clean Rooms API",
      status: "healthy",
      message: "Backend API is running. Frontend is hosted on Vercel.",
    });
  });

  app.use((req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) {
      return next();
    }
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Endpoint not found on backend API server.",
      },
    });
  });
}

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
