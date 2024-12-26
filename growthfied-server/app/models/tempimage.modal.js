const mongoose = require("mongoose");

const TempImageSchema = new mongoose.Schema(
  { 
    images: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tempimage", TempImageSchema);