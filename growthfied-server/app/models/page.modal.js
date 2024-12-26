const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    page_title: { type: String },
    page_content: { type: String },
    slug: { type: String }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", PageSchema);