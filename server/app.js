const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const logger = require("./utils/logger");
const errorMiddleware = require("./middleware/errorMiddleware");
const { swaggerUi, specs } = require("./swagger");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Serve static uploads
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/inquiries", inquiryRoutes);

// Serve frontend dist
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Catch-all route to serve React index.html for client-side routing
app.use((req, res, next) => {
  // If the request is for the API and wasn't caught by the API routes above,
  // let it fall through to the 404/error handler instead of serving HTML
  if (req.originalUrl.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"));
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
