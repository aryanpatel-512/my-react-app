const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
  productName: String,

  type: {
    type: String,
    default: "general"
  },

  status: {
    type: String,
    default: "new"
  },

  priority: {
    type: String,
    default: "normal"
  },

  notes: [
    {
      note: String,
      createdAt: Date
    }
  ],

  read: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Inquiry", inquirySchema);