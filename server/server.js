require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");
const logger = require("./utils/logger");

// Validate environment variables
validateEnv();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});