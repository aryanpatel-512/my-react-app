const express = require("express");
const categoryController = require("../controllers/categoryController");
const categoryValidator = require("../validators/categoryValidator");
const { verifyAdminToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", categoryController.getCategories);

router.post(
  "/",
  verifyAdminToken,
  categoryValidator.validateCategory,
  categoryController.createCategory
);

router.put(
  "/:id",
  verifyAdminToken,
  categoryValidator.validateCategory,
  categoryController.updateCategory
);

router.delete("/:id", verifyAdminToken, categoryController.deleteCategory);

module.exports = router;
