const express = require("express");
const productController = require("../controllers/productController");
const productValidator = require("../validators/productValidator");
const { verifyAdminToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const logAudit = require("../middleware/auditMiddleware");

const router = express.Router();

router.get("/", productController.getProducts);

router.post(
  "/",
  verifyAdminToken,
  upload.single("image"),
  productValidator.validateCreateProduct,
  logAudit("Product"),
  productController.createProduct
);

router.put(
  "/:id",
  verifyAdminToken,
  upload.single("image"),
  productValidator.validateUpdateProduct,
  logAudit("Product"),
  productController.updateProduct
);

router.delete("/:id", verifyAdminToken, logAudit("Product"), productController.deleteProduct);

module.exports = router;
