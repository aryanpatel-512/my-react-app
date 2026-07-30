const express = require("express");
const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");

const router = express.Router();

router.post("/login", authValidator.validateLogin, authController.login);

module.exports = router;
