const Inquiry = require("../models/Inquiry");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

const { sendInquiryNotification, sendWebsiteEnquiry, sendAdminReplyToCustomer } = require("../utils/emailService");

const getInquiries = asyncHandler(async (req, res) => {
  const data = await Inquiry.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
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

  // Send email notification to owner
  try {
    await sendInquiryNotification(inquiry);
  } catch (emailErr) {
    // Already logged inside emailService, catch here so it doesn't break the API response
  }

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

const submitEmailUs = asyncHandler(async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  // 1. Dispatch email via Nodemailer using configured Gmail SMTP
  try {
    await sendWebsiteEnquiry({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    });
  } catch (err) {
    logger.error(`Failed to dispatch website enquiry email: ${err.message}`);
    return next(ApiError.internal("Unable to send your message right now. Please try again."));
  }

  // 2. Persist enquiry into MongoDB Inquiry collection
  try {
    await Inquiry.create({
      name,
      phone: phone || "Not provided",
      email,
      message: `[Subject: ${subject}]\n\n${message}`,
      type: "general",
      status: "new",
      priority: "normal",
      read: false,
    });
  } catch (dbErr) {
    logger.warn(`Failed to store website enquiry in database: ${dbErr.message}`);
  }

  res.status(200).json({
    success: true,
    message: "Thank you for contacting Sri Srinivasa Clean Rooms. Our team will get back to you shortly.",
  });
});

const adminSendEmail = asyncHandler(async (req, res, next) => {
  const { to, subject, message } = req.body;

  try {
    await sendAdminReplyToCustomer({ to, subject, message });
    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    logger.error(`Admin send email failed: ${err.message}`);
    return next(ApiError.internal("Email could not be sent. Please check SMTP configuration."));
  }
});

module.exports = {
  getInquiries,
  createInquiry,
  markAsRead,
  updateStatus,
  updatePriority,
  addNote,
  deleteInquiry,
  submitEmailUs,
  adminSendEmail
};
