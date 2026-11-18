const SiteSetting = require("../models/SiteSetting");
const asyncHandler = require("../utils/asyncHandler");
const { processUploadedFile } = require("../utils/storageService");

const getHomepageSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSetting.findOne({ key: "homepage" }).lean();
  if (!settings) {
    settings = {
      heroBadge: "Precision · Purity · Trust",
      heroTitle: "Premium Medical Furniture & Clean Rooms",
      heroDesc: "We design and manufacture ICU beds, hospital furniture, modular clean room systems and healthcare infrastructure built for reliability — trusted by 50+ hospitals across India.",
      heroBannerImage: "",
      galleryImages: [],
    };
  }

  // Prevent proxy / browser caching
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  res.json({
    success: true,
    data: settings,
  });
});

const updateHomepageSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSetting.findOne({ key: "homepage" });
  if (!settings) {
    settings = new SiteSetting({ key: "homepage" });
  }

  if (req.body.heroBadge !== undefined) settings.heroBadge = req.body.heroBadge.trim();
  if (req.body.heroTitle !== undefined) settings.heroTitle = req.body.heroTitle.trim();
  if (req.body.heroDesc !== undefined) settings.heroDesc = req.body.heroDesc.trim();

  // If removeBanner requested
  if (req.body.removeBanner === "true" || req.body.removeBanner === true) {
    settings.heroBannerImage = "";
  }

  // If a new banner image is uploaded
  if (req.file) {
    const bannerUrl = await processUploadedFile(req.file);
    if (bannerUrl) {
      settings.heroBannerImage = bannerUrl;
    }
  }

  await settings.save();

  res.json({
    success: true,
    message: "Homepage Content Updated Successfully",
    data: settings,
  });
});

module.exports = {
  getHomepageSettings,
  updateHomepageSettings,
};
