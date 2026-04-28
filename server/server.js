const express = require("express");
const adminRoutes = require("./routes/adminRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const Product = require("./models/Product");
const Category = require("./models/Category");
const Inquiry = require("./models/Inquiry");

const app = express();

/* ===========================
   MIDDLEWARE
=========================== */
app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

/* ===========================
   MULTER IMAGE UPLOAD
=========================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ===========================
   MONGODB CONNECT
=========================== */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

/* ===========================
   TEST ROUTE
=========================== */
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    const defaultCategories = [
      "ICU Beds",
      "Fowler Beds",
      "Semi Fowler Beds",
      "Attendant Beds",
      "Beds",
      "Labor Tables",
      "Baby Care",
      "Examination Tables",
      "Lockers",
      "Instrument Trolleys",
      "Crash Carts",
      "Scrub Stations",
      "Trolleys",
      "Oxygen Trolleys",
      "Screens",
      "Stands",
      "Foot Steps",
      "IV Stands",
      "Waste Management",
      "Stools"
    ];

    for (const item of defaultCategories) {
      const exists = await Category.findOne({ name: item });

      if (!exists) {
        await Category.create({ name: item });
      }
    }

    console.log("✅ Default categories added");
  })
  .catch((err) => console.log("❌ DB Error:", err));

/* ===========================
   PRODUCTS
=========================== */

// ADD PRODUCT
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const newProduct = new Product({
      title: req.body.title,
      price: req.body.price,
      category: req.body.category,
      desc: req.body.desc,
      image: req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : "",
    });

    await newProduct.save();

    res.json({
      success: true,
      message: "Product Added Successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const data = await Product.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// UPDATE PRODUCT
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      price: req.body.price,
      category: req.body.category,
      desc: req.body.desc,
    };

    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ===========================
   INQUIRIES
=========================== */

// GET ALL INQUIRIES
app.get("/api/inquiries", async (req, res) => {
  try {
    const data = await Inquiry.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ADD INQUIRY
app.post("/api/inquiries", async (req, res) => {
  try {
    const inquiry = new Inquiry({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      message: req.body.message,
      productName: req.body.productName || "",
      type: req.body.type || "general",
      read: false
    });

    await inquiry.save();

    res.json({
      success: true,
      inquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// MARK AS READ
app.put("/api/inquiries/:id/read", async (req, res) => {
  try {
    await Inquiry.findByIdAndUpdate(req.params.id, { read: true });

    res.json({
      success: true,
      message: "Marked as Read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// UPDATE STATUS
app.put("/api/inquiries/:id/status", async (req, res) => {
  try {
    await Inquiry.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });

    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// UPDATE PRIORITY
app.put("/api/inquiries/:id/priority", async (req, res) => {
  try {
    await Inquiry.findByIdAndUpdate(req.params.id, {
      priority: req.body.priority,
    });

    res.json({
      success: true,
      message: "Priority Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ADD NOTE
app.post("/api/inquiries/:id/notes", async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    inquiry.notes.push({
      note: req.body.note,
      createdAt: new Date(),
    });

    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE INQUIRY
app.delete("/api/inquiries/:id", async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Inquiry Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ===========================
   CATEGORIES
=========================== */

// GET ALL CATEGORIES
app.get("/api/categories", async (req, res) => {
  try {
    const data = await Category.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ADD CATEGORY
app.post("/api/categories", async (req, res) => {
  try {
    const exists = await Category.findOne({
      name: req.body.name.trim(),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = new Category({
      name: req.body.name.trim(),
    });

    await category.save();

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// UPDATE CATEGORY
app.put("/api/categories/:id", async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name.trim() },
      { new: true }
    );

    res.json({
      success: true,
      category: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE CATEGORY
app.delete("/api/categories/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ===========================
   START SERVER
=========================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});