const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  title: String,
  category: String,
  price: String,
  image: String,
  desc: String
},
{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);