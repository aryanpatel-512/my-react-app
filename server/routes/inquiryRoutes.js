const express = require("express");
const inquiryController = require("../controllers/inquiryController");
const inquiryValidator = require("../validators/inquiryValidator");
const { verifyAdminToken } = require("../middleware/authMiddleware");
const logAudit = require("../middleware/auditMiddleware");

const router = express.Router();

// Public route for customers to submit inquiries
router.post(
  "/",
  inquiryValidator.validateCreateInquiry,
  inquiryController.createInquiry
);

// Protected admin routes
router.use(verifyAdminToken); // Apply to all routes below

router.get("/", inquiryController.getInquiries);
router.put("/:id/read", logAudit("Inquiry"), inquiryController.markAsRead);
router.put("/:id/status", inquiryValidator.validateUpdateStatus, logAudit("Inquiry"), inquiryController.updateStatus);
router.put("/:id/priority", inquiryValidator.validateUpdatePriority, logAudit("Inquiry"), inquiryController.updatePriority);
router.post("/:id/notes", inquiryValidator.validateAddNote, logAudit("Inquiry"), inquiryController.addNote);
router.delete("/:id", logAudit("Inquiry"), inquiryController.deleteInquiry);

module.exports = router;
