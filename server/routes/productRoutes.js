const express = require("express");
const productController = require("../controllers/productController");
const productValidator = require("../validators/productValidator");
const { verifyAdminToken, optionalAdminToken } = require("../middleware/authMiddleware");
const { productUpload } = require("../middleware/uploadMiddleware");
const logAudit = require("../middleware/auditMiddleware");

const router = express.Router();

// Public routes (with optional admin preview for disabled items)
router.get("/", optionalAdminToken, productController.getProducts);
router.get("/:id", optionalAdminToken, productController.getProductById);

// Protected admin routes
router.post(
  "/",
  verifyAdminToken,
  productUpload,
  productValidator.validateCreateProduct,
  logAudit("Product"),
  productController.createProduct
);

router.put(
  "/:id",
  verifyAdminToken,
  productUpload,
  productValidator.validateUpdateProduct,
  logAudit("Product"),
  productController.updateProduct
);

router.patch(
  "/:id/status",
  verifyAdminToken,
  logAudit("Product"),
  productController.toggleProductStatus
);

router.delete("/:id", verifyAdminToken, logAudit("Product"), productController.deleteProduct);

module.exports = router;
