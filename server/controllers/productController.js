const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const getProducts = asyncHandler(async (req, res) => {
  const data = await Product.find().sort({ createdAt: -1 });
  res.json(data);
});

const createProduct = asyncHandler(async (req, res) => {
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : "";

  const newProduct = await Product.create({
    title: req.body.title,
    price: req.body.price,
    category: req.body.category,
    desc: req.body.desc,
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Product Added Successfully",
    product: newProduct,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw ApiError.notFound("Product not found");
  }

  res.json({
    success: true,
    message: "Product Updated Successfully",
    product: updatedProduct,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  res.json({
    success: true,
    message: "Deleted Successfully",
  });
});

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
