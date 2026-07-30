const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true }
);

categorySchema.index({ name: 1 });
categorySchema.index({ isDeleted: 1 });

module.exports = mongoose.model("Category", categorySchema);