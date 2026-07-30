const Inquiry = require("../models/Inquiry");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const getInquiries = asyncHandler(async (req, res) => {
  const data = await Inquiry.find({ isDeleted: false }).sort({ createdAt: -1 });
  res.json({ success: true, data, count: data.length });
});

const createInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    message: req.body.message,
    productName: req.body.productName,
    type: req.body.type || "general",
    read: false,
  });

  res.status(201).json({
    success: true,
    data: inquiry,
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const updated = await Inquiry.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false }, 
    { read: true },
    { new: true }
  );
  if (!updated) {
    throw ApiError.notFound("Inquiry not found");
  }

  res.json({
    success: true,
    message: "Marked as Read",
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const updated = await Inquiry.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false }, 
    { status: req.body.status },
    { runValidators: true, new: true }
  );
  
  if (!updated) {
    throw ApiError.notFound("Inquiry not found");
  }

  res.json({
    success: true,
    message: "Status Updated",
  });
});

const updatePriority = asyncHandler(async (req, res) => {
  const updated = await Inquiry.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false }, 
    { priority: req.body.priority },
    { runValidators: true, new: true }
  );
  
  if (!updated) {
    throw ApiError.notFound("Inquiry not found");
  }

  res.json({
    success: true,
    message: "Priority Updated",
  });
});

const addNote = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findOne({ _id: req.params.id, isDeleted: false });
  if (!inquiry) {
    throw ApiError.notFound("Inquiry not found");
  }

  inquiry.notes.push({
    note: req.body.note,
    createdAt: req.body.createdAt || new Date(),
  });

  await inquiry.save();

  res.json({
    success: true,
    data: inquiry,
  });
});

const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!inquiry) {
    throw ApiError.notFound("Inquiry not found");
  }

  res.json({
    success: true,
    message: "Inquiry Deleted",
  });
});

module.exports = {
  getInquiries,
  createInquiry,
  markAsRead,
  updateStatus,
  updatePriority,
  addNote,
  deleteInquiry
};
