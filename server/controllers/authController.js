const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin || !admin.isActive) {
    throw ApiError.unauthorized("Invalid Credentials");
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid Credentials");
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = jwt.sign(
    { username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  res.json({
    success: true,
    message: "Login Successful",
    token,
  });
});

module.exports = { login };
