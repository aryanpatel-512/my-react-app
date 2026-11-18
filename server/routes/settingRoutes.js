const express = require("express");
const settingController = require("../controllers/settingController");
const { verifyAdminToken } = require("../middleware/authMiddleware");
const { singleImageUpload } = require("../middleware/uploadMiddleware");
const logAudit = require("../middleware/auditMiddleware");

const router = express.Router();

// Public route to fetch homepage banner and text
router.get("/homepage", settingController.getHomepageSettings);

// Protected admin route to update homepage banner and text
router.put(
  "/homepage",
  verifyAdminToken,
  singleImageUpload,
  logAudit("SiteSetting"),
  settingController.updateHomepageSettings
);

module.exports = router;
