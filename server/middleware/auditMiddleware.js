const AuditLog = require("../models/AuditLog");
const asyncHandler = require("../utils/asyncHandler");

const logAudit = (entity) => {
  return asyncHandler(async (req, res, next) => {
    // Only log mutations (POST, PUT, DELETE, PATCH)
    if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
      // Capture the original res.json to log after successful completion
      const originalJson = res.json;
      res.json = function (data) {
        // Only log if the request was successful
        if (res.statusCode >= 200 && res.statusCode < 300 && data.success) {
          let action = "UNKNOWN";
          if (req.method === "POST") action = "CREATE";
          else if (req.method === "PUT" || req.method === "PATCH") action = "UPDATE";
          else if (req.method === "DELETE") action = "DELETE";

          const entityId = req.params.id || (data.data && data.data._id) || null;

          AuditLog.create({
            adminId: req.admin ? req.admin._id : null, // Assuming req.admin is set by authMiddleware
            action,
            entity,
            entityId,
            ipAddress: req.ip || req.connection.remoteAddress,
            details: req.body, // Log payload for context (omit passwords/sensitive info in real apps)
          }).catch(err => console.error("Audit Log Error:", err));
        }
        
        originalJson.call(this, data);
      };
    }
    next();
  });
};

module.exports = logAudit;
