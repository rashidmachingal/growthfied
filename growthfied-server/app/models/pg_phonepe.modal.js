const mongoose = require("mongoose");

const PgPhonePeSchema = new mongoose.Schema(
  { 
    user_id: { type: String },
    mid: { type: String },
    salt_key: { type: String },
    salt_key_index: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PgPhonePe", PgPhonePeSchema);