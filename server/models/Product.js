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
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true }
);

// Indexes for search and filtering performance
productSchema.index({ title: "text", desc: "text" });
productSchema.index({ category: 1 });
productSchema.index({ isDeleted: 1 });

module.exports = mongoose.model("Product", productSchema);