const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "homepage",
    },
    heroBadge: {
      type: String,
      default: "Precision · Purity · Trust",
      trim: true,
    },
    heroTitle: {
      type: String,
      default: "Premium Medical Furniture & Clean Rooms",
      trim: true,
    },
    heroDesc: {
      type: String,
      default: "We design and manufacture ICU beds, hospital furniture, modular clean room systems and healthcare infrastructure built for reliability — trusted by 50+ hospitals across India.",
      trim: true,
    },
    heroBannerImage: {
      type: String,
      default: "",
    },
    galleryImages: [
      {
        title: { type: String, trim: true },
        image: { type: String, trim: true },
        caption: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
