const mongoose = require("mongoose");
const dns = require("dns");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    await mongoose.connect(process.env.MONGO_URL);
    logger.info("MongoDB Connected");
  } catch (err) {
    logger.error("DB Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
