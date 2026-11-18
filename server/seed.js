require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const dns = require("dns");
const fs = require("fs");
const path = require("path");
const Product = require("./models/Product");
const Admin = require("./models/Admin");
const Category = require("./models/Category");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

mongoose.connect(process.env.MONGO_URL)
.then(async () => {
  console.log("✅ MongoDB Connected");

  // 1. Seed Admin
  const targetUser = process.env.ADMIN_USER || "admin";
  const adminExists = await Admin.findOne({ username: targetUser });
  if (!adminExists) {
    if (!process.env.ADMIN_PASS) {
      console.error("❌ ADMIN_PASS is required in .env to create admin.");
      process.exit(1);
    }
    await Admin.create({
      username: targetUser,
      passwordHash: process.env.ADMIN_PASS, // Will be hashed by pre-save hook
      email: "admin@srisrinivasa.com"
    });
    console.log(`👤 Admin Created (${targetUser})`);
  } else {
    console.log(`👤 Admin (${targetUser}) already exists`);
  }

  // 2. Seed Default Categories
  const defaultCategories = [
    "ICU Beds", "Hospital Beds", "Operation Theatre Tables",
    "Examination Tables", "Medical Lockers", "Hospital Trolleys",
    "Clean Room Equipment", "Nurse Stations", "Stretchers", "Wheelchairs"
  ];
  
  const count = await Category.countDocuments();
  if (count === 0) {
    const categoriesToInsert = defaultCategories.map(name => ({ name }));
    await Category.insertMany(categoriesToInsert);
    console.log("📁 Default Categories Inserted");
  } else {
    console.log("📁 Categories already exist");
  }

  // 3. Optional Products seed
  try {
    const existingCount = await Product.countDocuments();
    if (existingCount === 0) {
      const clientProductsPath = path.join(__dirname, "../client/src/data/products.js");
      const rootProductsPath = path.join(__dirname, "../src/data/products.js");
      const targetPath = fs.existsSync(clientProductsPath)
        ? "../client/src/data/products"
        : fs.existsSync(rootProductsPath)
        ? "../src/data/products"
        : null;

      if (targetPath) {
        const products = require(targetPath).default;
        if (products && products.length > 0) {
          await Product.insertMany(products);
          console.log("🔥 Products Inserted Successfully");
        }
      }
    } else {
      console.log(`ℹ️ Products already exist (${existingCount} products in DB). Skipping product seed.`);
    }
  } catch (err) {
    console.log("ℹ️ No products to seed or error:", err.message);
  }

  process.exit();
})
.catch(err => {
  console.log("❌ DB Error:", err);
  process.exit(1);
});