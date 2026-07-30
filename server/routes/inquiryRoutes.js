const express = require("express");
const inquiryController = require("../controllers/inquiryController");
const inquiryValidator = require("../validators/inquiryValidator");
const { verifyAdminToken } = require("../middleware/authMiddleware");

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
router.put("/:id/read", inquiryController.markAsRead);
router.put("/:id/status", inquiryValidator.validateUpdateStatus, inquiryController.updateStatus);
router.put("/:id/priority", inquiryValidator.validateUpdatePriority, inquiryController.updatePriority);
router.post("/:id/notes", inquiryValidator.validateAddNote, inquiryController.addNote);
router.delete("/:id", inquiryController.deleteInquiry);

module.exports = router;
