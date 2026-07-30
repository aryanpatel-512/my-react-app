const express = require("express");
const productController = require("../controllers/productController");
const productValidator = require("../validators/productValidator");
const { verifyAdminToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", productController.getProducts);

router.post(
  "/",
  verifyAdminToken,
  upload.single("image"),
  productValidator.validateCreateProduct,
  productController.createProduct
);

router.put(
  "/:id",
  verifyAdminToken,
  upload.single("image"),
  productValidator.validateUpdateProduct,
  productController.updateProduct
);

router.delete("/:id", verifyAdminToken, productController.deleteProduct);

module.exports = router;
