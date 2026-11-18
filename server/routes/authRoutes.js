const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many login attempts from this IP, please try again after 15 minutes"
    },
    message: "Too many login attempts from this IP, please try again after 15 minutes"
  },
});

router.post("/login", authLimiter, authValidator.validateLogin, authController.login);
router.post("/refresh", authController.refresh);

module.exports = router;
