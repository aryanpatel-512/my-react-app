const logger = require("../utils/logger");

const validateEnv = () => {
  const required = [
    "MONGO_URL",
    "PORT",
    "JWT_SECRET",
    "JWT_EXPIRES_IN"
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
};

module.exports = { validateEnv };
