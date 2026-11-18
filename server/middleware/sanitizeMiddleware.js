/**
 * NoSQL Injection Protection Middleware for Express 5
 * Safely sanitizes incoming request payloads by stripping any key starting with '$' or containing '.'
 * Compatible with Express 5 (does not mutate read-only query getters).
 */

function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const clean = {};
  for (const key of Object.keys(obj)) {
    // Drop keys starting with '$' (MongoDB operator injection) or containing '.'
    if (key.startsWith("$") || key.includes(".")) {
      continue;
    }
    clean[key] = sanitizeObject(obj[key]);
  }
  return clean;
}

const noSqlSanitizer = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }
  next();
};

module.exports = noSqlSanitizer;
