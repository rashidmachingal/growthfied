const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  { 
    user_id: { type: String },
    status: { type: String, default: "Active" },
    category_name: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);