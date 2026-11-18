const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const Admin = require("../models/Admin");

const verifyAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Authentication required");
    }

    const token = authHeader.split(" ")[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw ApiError.unauthorized("Invalid or expired token");
    }

    const admin = await Admin.findOne({ username: decoded.username });
    if (!admin || !admin.isActive) {
      throw ApiError.unauthorized("Admin not found or inactive");
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(ApiError.forbidden("You do not have permission to perform this action"));
    }
    next();
  };
};

const optionalAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ username: decoded.username });
        if (admin && admin.isActive) {
          req.admin = admin;
        }
      } catch (err) {
        // Silently ignore on optional auth
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyAdminToken, authorizeRoles, optionalAdminToken };

