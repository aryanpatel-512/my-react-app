require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dns = require("dns");
const Product = require("./models/Product");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uploadsDir = path.join(__dirname, "uploads");

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    
    await Product.deleteMany();
    console.log("🗑 Cleared existing products");

    let imageFiles = [];
    if (fs.existsSync(uploadsDir)) {
      imageFiles = fs.readdirSync(uploadsDir).filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i));
      // Sort by creation time so the mapping is deterministic and somewhat chronological
      imageFiles.sort((a, b) => fs.statSync(path.join(uploadsDir, a)).mtimeMs - fs.statSync(path.join(uploadsDir, b)).mtimeMs);
    }

    let products = require("../src/data/products").default;
    if (!products) {
      products = [];
    }

    const finalProducts = [];

    // Map the medical equipment names/prices to the uploaded images
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const imageUrl = `http://localhost:10000/uploads/${file}`;

      if (i < products.length) {
        // We have a corresponding medical product title/price from the dummy data
        const p = products[i];
        finalProducts.push({
          title: p.title,
          category: p.category,
          price: p.price,
          desc: p.desc || "Medical equipment",
          image: imageUrl
        });
      } else {
        // We ran out of dummy names, create generic ones
        finalProducts.push({
          title: `Premium Medical Equipment ${i + 1}`,
          category: "Miscellaneous",
          price: "Contact for Price",
          desc: "Premium grade hospital equipment.",
          image: imageUrl
        });
      }
    }

    if (finalProducts.length > 0) {
      await Product.insertMany(finalProducts);
      console.log(`🔥 Successfully inserted ${finalProducts.length} products with original images and realistic medical names!`);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
