const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const getProducts = asyncHandler(async (req, res) => {
  const { search, category, page, limit } = req.query;
  const filter = { isDeleted: false };
  
  if (category && category !== "All") {
    filter.category = category;
  }
  
  if (search) {
    filter.$text = { $search: search };
  }
  
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 1000;
  const skip = (pageNumber - 1) * pageSize;
  
  const data = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);
    
  res.json({ success: true, data, count: data.length, page: pageNumber, totalPages: Math.ceil(data.length / pageSize) });
});

const createProduct = asyncHandler(async (req, res) => {
  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
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
    data: newProduct,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedProduct || updatedProduct.isDeleted) {
    throw ApiError.notFound("Product not found");
  }

  res.json({
    success: true,
    message: "Product Updated Successfully",
    data: updatedProduct,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  res.json({
    success: true,
    message: "Deleted Successfully",
  });
});

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
