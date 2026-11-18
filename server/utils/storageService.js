const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const logger = require("./logger");

// Configure Cloudinary if environment variables are present
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_URL || 
  (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
);

if (isCloudinaryConfigured) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  logger.info("Cloudinary storage service initialized");
} else {
  logger.info("Cloudinary credentials not detected; using persistent local disk storage (/uploads)");
}

/**
 * Persists an uploaded multer file.
 * If Cloudinary is configured, uploads the file to Cloudinary cloud object storage.
 * Otherwise, returns the root-relative /uploads/<filename> path.
 *
 * @param {Express.Multer.File} file
 * @returns {Promise<string>} Public URL/path for the image
 */
async function processUploadedFile(file) {
  if (!file) return "";

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "sri_srinivasa/products",
        resource_type: "image",
      });
      // Optionally remove temporary local file after successful Cloudinary upload
      try {
        fs.unlinkSync(file.path);
      } catch (cleanupErr) {
        // ignore cleanup error
      }
      return result.secure_url;
    } catch (err) {
      logger.error(`Cloudinary upload failed for ${file.originalname}: ${err.message}. Falling back to local disk.`);
      return `/uploads/${file.filename}`;
    }
  }

  // Local storage default
  return `/uploads/${file.filename}`;
}

module.exports = {
  isCloudinaryConfigured,
  processUploadedFile,
};
