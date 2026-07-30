const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
  message: "Too many login attempts from this IP, please try again after 15 minutes",
});

router.post("/login", authLimiter, authValidator.validateLogin, authController.login);

module.exports = router;
