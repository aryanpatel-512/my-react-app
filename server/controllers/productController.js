const mongoose = require("mongoose");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { processUploadedFile } = require("../utils/storageService");

/**
 * Helper to safely parse specifications
 */
const parseSpecifications = (rawSpecs) => {
  if (!rawSpecs) return [];
  if (Array.isArray(rawSpecs)) return rawSpecs;
  if (typeof rawSpecs === "string") {
    try {
      const parsed = JSON.parse(rawSpecs);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

/**
 * GET /api/v1/products
 * Public list with search, category filtering, ordering, and pagination
 */
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, page, limit, includeInactive } = req.query;
  const filter = { isDeleted: { $ne: true } };

  // Only return active products unless admin specifically requests all
  if (includeInactive !== "true") {
    filter.isActive = { $ne: false };
  }

  if (category && category !== "All") {
    filter.category = category;
  }

  if (search && search.trim()) {
    filter.$text = { $search: search.trim() };
  }

  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 1000;
  const skip = (pageNumber - 1) * pageSize;

  const [totalCount, data] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
  ]);

  data.forEach((p) => {
    if (!Array.isArray(p.images)) p.images = [];
    if (!Array.isArray(p.specifications)) p.specifications = [];
  });

  res.json({
    success: true,
    data,
    count: data.length,
    totalCount,
    page: pageNumber,
    totalPages: Math.ceil(totalCount / pageSize) || 1,
  });
});

/**
 * GET /api/v1/products/:id
 * Dedicated single product endpoint
 */
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.notFound("Product not found");
  }

  const product = await Product.findOne({
    _id: id,
    isDeleted: { $ne: true },
  }).lean();

  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  // If inactive and public visitor, hide product
  const isAdmin = Boolean(req.admin);
  if (product.isActive === false && !isAdmin) {
    throw ApiError.notFound("Product is currently unavailable");
  }

  if (!Array.isArray(product.images)) product.images = [];
  if (!Array.isArray(product.specifications)) product.specifications = [];

  res.json({
    success: true,
    data: product,
  });
});

/**
 * POST /api/v1/products
 * Admin creates new product with optional specifications and multiple images
 */
const createProduct = asyncHandler(async (req, res) => {
  let primaryImageUrl = "";
  const additionalImageUrls = [];

  // Handle uploaded files via multer
  if (req.files) {
    if (req.files.image && req.files.image[0]) {
      primaryImageUrl = await processUploadedFile(req.files.image[0]);
    }
    if (req.files.additionalImages && req.files.additionalImages.length > 0) {
      for (const file of req.files.additionalImages) {
        const url = await processUploadedFile(file);
        if (url) additionalImageUrls.push(url);
      }
    }
  } else if (req.file) {
    primaryImageUrl = await processUploadedFile(req.file);
  }

  if (additionalImageUrls.length > 5) {
    throw ApiError.badRequest("A maximum of 5 additional gallery images is allowed per product");
  }

  const specifications = parseSpecifications(req.body.specifications);

  const isActive = req.body.isActive === undefined 
    ? true 
    : req.body.isActive === true || req.body.isActive === "true";

  const order = req.body.order !== undefined ? parseInt(req.body.order, 10) || 0 : 0;

  const newProduct = await Product.create({
    title: req.body.title,
    price: req.body.price,
    category: req.body.category,
    desc: req.body.desc,
    image: primaryImageUrl,
    images: additionalImageUrls,
    specifications,
    isActive,
    order,
  });

  res.status(201).json({
    success: true,
    message: "Product Added Successfully",
    data: newProduct,
  });
});

/**
 * PUT /api/v1/products/:id
 * Admin updates product details, specifications, primary image, or additional images
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.notFound("Product not found");
  }

  const existingProduct = await Product.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!existingProduct) {
    throw ApiError.notFound("Product not found");
  }

  const updateData = {};

  if (req.body.title !== undefined) updateData.title = req.body.title;
  if (req.body.price !== undefined) updateData.price = req.body.price;
  if (req.body.category !== undefined) updateData.category = req.body.category;
  if (req.body.desc !== undefined) updateData.desc = req.body.desc;

  if (req.body.isActive !== undefined) {
    updateData.isActive = req.body.isActive === true || req.body.isActive === "true";
  }

  if (req.body.order !== undefined) {
    updateData.order = parseInt(req.body.order, 10) || 0;
  }

  if (req.body.specifications !== undefined) {
    updateData.specifications = parseSpecifications(req.body.specifications);
  }

  // Handle primary image update
  if (req.files && req.files.image && req.files.image[0]) {
    updateData.image = await processUploadedFile(req.files.image[0]);
  } else if (req.file) {
    updateData.image = await processUploadedFile(req.file);
  }

  // Handle additional images: append new uploaded files
  let currentImages = Array.isArray(existingProduct.images) ? [...existingProduct.images] : [];

  // Remove images requested for deletion
  if (req.body.removedImages) {
    let removedList = [];
    try {
      removedList = typeof req.body.removedImages === "string" 
        ? JSON.parse(req.body.removedImages) 
        : req.body.removedImages;
    } catch (e) {
      removedList = [req.body.removedImages];
    }
    if (Array.isArray(removedList)) {
      currentImages = currentImages.filter(img => !removedList.includes(img));
    }
  }

  const newFiles = (req.files && req.files.additionalImages) ? req.files.additionalImages : [];
  if (currentImages.length + newFiles.length > 5) {
    throw ApiError.badRequest(`A maximum of 5 additional gallery images is allowed. Currently has ${currentImages.length} retained image(s), cannot add ${newFiles.length} more.`);
  }

  if (newFiles.length > 0) {
    for (const file of newFiles) {
      const url = await processUploadedFile(file);
      if (url) currentImages.push(url);
    }
  }

  updateData.images = currentImages;

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: "Product Updated Successfully",
    data: updatedProduct,
  });
});

/**
 * PATCH /api/v1/products/:id/status
 * Quick toggle for enable / disable
 */
const toggleProductStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.notFound("Product not found");
  }

  const product = await Product.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }

  const newStatus = req.body.isActive !== undefined 
    ? Boolean(req.body.isActive) 
    : !product.isActive;

  product.isActive = newStatus;
  await product.save();

  res.json({
    success: true,
    message: `Product ${newStatus ? "Enabled" : "Disabled"} Successfully`,
    data: { _id: product._id, isActive: product.isActive },
  });
});

/**
 * DELETE /api/v1/products/:id
 * Soft delete product
 */
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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
};
