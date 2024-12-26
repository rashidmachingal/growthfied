const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  { 
    username: { type: String },
    domain_name: { type: String },
    is_domain_enabled: { type: Boolean, default: false },
    store_name: { type: String },
    mobile_number: { type: String },
    whatsapp_number: { type: String },
    email: { type: String },
    password: { type: String },
    profile_picture: { type: String },
    bio: { type: String },
    delivery_charge: { type: Number, default: 30 },
    on_boarding: { type: Boolean, default: false },
    subscription: {
       status: { type : String },
       expires_at: { type: Date}
    },
    otp: {
      code: String,
      expiry: Date
    },
    currency: { type: String, default: "INR" },
    meta_title: { type: String },
    meta_description: { type: String },
    favicon: { type: String, default: "no-favicon" },
    device_info : {
      ip: { type: String },
      ua: { type: Object }
    },
    payment_method: {
      cod: { type: Boolean, default: true },
      online: { 
        enabled: { type: Boolean, default: false },
        pg_name: { type: String, default: "Razorpay" }
      }
    },
    razorpay_keys: {
      key_id: { type: String },
      key_secret: { type: String }
    },
    footer: { type: String },
    analytics_id: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);