require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("✅ MongoDB Connected");

  const products = require("../src/data/products").default;

  await Product.deleteMany();
  console.log("🗑 Old Products Deleted");

  await Product.insertMany(products);
  console.log("🔥 Products Inserted Successfully");

  process.exit();
})
.catch(err => console.log(err));