const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    specifications: [
      {
        key: { type: String, trim: true, maxlength: 100 },
        value: { type: String, trim: true, maxlength: 250 },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for search, filtering, and ordering performance
productSchema.index({ title: "text", desc: "text" });
productSchema.index({ category: 1 });
productSchema.index({ isDeleted: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ order: 1 });

module.exports = mongoose.model("Product", productSchema);