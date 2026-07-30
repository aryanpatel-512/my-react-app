const express = require("express");
const categoryController = require("../controllers/categoryController");
const categoryValidator = require("../validators/categoryValidator");
const { verifyAdminToken } = require("../middleware/authMiddleware");
const logAudit = require("../middleware/auditMiddleware");

const router = express.Router();

router.get("/", categoryController.getCategories);

router.post(
  "/",
  verifyAdminToken,
  categoryValidator.validateCategory,
  logAudit("Category"),
  categoryController.createCategory
);

router.put(
  "/:id",
  verifyAdminToken,
  categoryValidator.validateCategory,
  logAudit("Category"),
  categoryController.updateCategory
);

router.delete("/:id", verifyAdminToken, logAudit("Category"), categoryController.deleteCategory);

module.exports = router;
