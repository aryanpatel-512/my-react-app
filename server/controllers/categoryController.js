const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const getCategories = asyncHandler(async (req, res) => {
  const data = await Category.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
  res.json({ success: true, data, count: data.length });
});

const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name.trim();
  
  const exists = await Category.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    isDeleted: { $ne: true } 
  });
  
  if (exists) {
    throw ApiError.conflict("Category already exists");
  }

  const category = await Category.create({ name });

  res.status(201).json({
    success: true,
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const name = req.body.name.trim();

  const exists = await Category.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    _id: { $ne: req.params.id },
    isDeleted: { $ne: true }
  });
  
  if (exists) {
    throw ApiError.conflict("Category name already exists");
  }

  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true, runValidators: true }
  );

  if (!updated || updated.isDeleted) {
    throw ApiError.notFound("Category not found");
  }

  res.json({
    success: true,
    data: updated,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!category) {
    throw ApiError.notFound("Category not found");
  }

  res.json({
    success: true,
    message: "Category Deleted",
  });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
