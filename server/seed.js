require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const dns = require("dns");
const Product = require("./models/Product");
const Admin = require("./models/Admin");
const Category = require("./models/Category");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

mongoose.connect(process.env.MONGO_URL)
.then(async () => {
  console.log("✅ MongoDB Connected");

  // 1. Seed Admin
  const adminExists = await Admin.findOne({ username: "admin" });
  if (!adminExists) {
    await Admin.create({
      username: "admin",
      passwordHash: "admin123", // Will be hashed by pre-save hook
      email: "admin@example.com"
    });
    console.log("👤 Default Admin Created (admin / admin123)");
  } else {
    console.log("👤 Admin already exists");
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
    const products = require("../src/data/products").default;
    if (products && products.length > 0) {
      await Product.deleteMany();
      await Product.insertMany(products);
      console.log("🔥 Products Inserted Successfully");
    }
  } catch (err) {
    console.log("⚠️ No products to seed");
  }

  process.exit();
})
.catch(err => {
  console.log("❌ DB Error:", err);
  process.exit(1);
});