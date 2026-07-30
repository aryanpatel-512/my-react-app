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

  const accessToken = jwt.sign(
    { username: admin.username, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: admin.username },
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    { expiresIn: "7d" }
  );

  admin.lastLoginAt = new Date();
  admin.refreshToken = refreshToken;
  await admin.save();

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    success: true,
    message: "Login Successful",
    data: { token: accessToken },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const cookies = req.headers.cookie;
  if (!cookies) throw ApiError.unauthorized("No cookies found");

  const jwtCookie = cookies.split("; ").find(row => row.startsWith("jwt="));
  if (!jwtCookie) throw ApiError.unauthorized("Refresh token not found");

  const refreshToken = jwtCookie.split("=")[1];

  const admin = await Admin.findOne({ refreshToken });
  if (!admin || !admin.isActive) {
    throw ApiError.forbidden("Invalid refresh token");
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret");
    
    const accessToken = jwt.sign(
      { username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      success: true,
      data: { token: accessToken }
    });
  } catch (err) {
    throw ApiError.forbidden("Refresh token expired or invalid");
  }
});

module.exports = { login, refresh };
