const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  image: String,
  desc: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);