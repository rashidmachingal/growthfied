const mongoose = require("mongoose");

const CoupenSchema = new mongoose.Schema(
  {
    user_id: String,
    coupen_code: String,
    discount: {
        type: { type: String },
        value: { type: Number }
    },
    minimum: { type: Number},
    applies: {
        type: { type: String },
        products: { type: Array }
    },
    end_date: Date,
    count: Number,
    used: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupen", CoupenSchema);