require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dns = require("dns");
const Product = require("./models/Product");
const Category = require("./models/Category");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uploadsDir = path.join(__dirname, "uploads");

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    
    // Clear the dummy products
    await Product.deleteMany();
    console.log("🗑 Cleared dummy products");

    // Ensure we have at least one category to assign to recovered products
    let defaultCategory = await Category.findOne();
    if (!defaultCategory) {
      defaultCategory = await Category.create({ name: "Recovered Items" });
    }

    // Read the uploads directory
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i));
      
      console.log(`🔍 Found ${imageFiles.length} original uploaded images.`);

      const productsToInsert = imageFiles.map((file, index) => {
        // We don't know original names, so we make them generic
        return {
          title: `Recovered Product ${index + 1}`,
          category: defaultCategory.name,
          price: "0",
          desc: "This product was automatically recovered from uploaded images. Please update its name and price.",
          image: `http://localhost:10000/uploads/${file}`
        };
      });

      if (productsToInsert.length > 0) {
        await Product.insertMany(productsToInsert);
        console.log(`🔥 Successfully recovered and inserted ${productsToInsert.length} products!`);
      }
    } else {
      console.log("⚠️ No uploads directory found.");
    }

    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
