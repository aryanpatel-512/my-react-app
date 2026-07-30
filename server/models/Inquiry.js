const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  productName: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ["general", "product"],
    default: "general"
  },
  status: {
    type: String,
    enum: ["new", "contacted", "in_progress", "quotation", "negotiation", "closed", "rejected"],
    default: "new"
  },
  priority: {
    type: String,
    enum: ["normal", "hot", "bulk", "dealer", "urgent", "hospital"],
    default: "normal"
  },
  notes: [
    {
      note: {
        type: String,
        trim: true,
        maxlength: 1000
      },
      createdAt: Date
    }
  ],
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Inquiry", inquirySchema);