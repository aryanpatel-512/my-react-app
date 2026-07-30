const express = require("express");
const cors = require("cors");
const path = require("path");
const errorMiddleware = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static uploads
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/inquiries", inquiryRoutes);

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
