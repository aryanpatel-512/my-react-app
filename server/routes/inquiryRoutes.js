const express = require("express");
const rateLimit = require("express-rate-limit");
const inquiryController = require("../controllers/inquiryController");
const inquiryValidator = require("../validators/inquiryValidator");
const { verifyAdminToken } = require("../middleware/authMiddleware");
const logAudit = require("../middleware/auditMiddleware");

const router = express.Router();

// Rate limiter for general public inquiries: 15 inquiries / 15 mins per IP
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many inquiries submitted from this IP. Please try again after 15 minutes or contact us directly by phone.",
    },
    message: "Too many inquiries submitted from this IP. Please try again after 15 minutes or contact us directly by phone.",
  },
});

// Rate limiter for "Email Us" modal: 10 messages / 15 mins per IP
const emailUsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many messages sent from this IP. Please try again after 15 minutes.",
    },
    message: "Too many messages sent from this IP. Please try again after 15 minutes.",
  },
});

// Public route for customers to submit inquiries
router.post(
  "/",
  inquiryLimiter,
  inquiryValidator.validateCreateInquiry,
  inquiryController.createInquiry
);

// Public route for "Email Us" modal
router.post(
  "/email-us",
  emailUsLimiter,
  inquiryValidator.validateEmailUs,
  inquiryController.submitEmailUs
);

// Protected admin routes
router.use(verifyAdminToken); // Apply to all routes below

router.get("/", inquiryController.getInquiries);
router.put("/:id/read", logAudit("Inquiry"), inquiryController.markAsRead);
router.put("/:id/status", inquiryValidator.validateUpdateStatus, logAudit("Inquiry"), inquiryController.updateStatus);
router.put("/:id/priority", inquiryValidator.validateUpdatePriority, logAudit("Inquiry"), inquiryController.updatePriority);
router.post("/:id/notes", inquiryValidator.validateAddNote, logAudit("Inquiry"), inquiryController.addNote);
router.post("/send-email", inquiryValidator.validateAdminSendEmail, inquiryController.adminSendEmail);
router.delete("/:id", logAudit("Inquiry"), inquiryController.deleteInquiry);

module.exports = router;
