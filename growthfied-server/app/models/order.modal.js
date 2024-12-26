const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    store_id: { type: String },
    email: { type: String },
    mobile_number: { type: String },
    order_id: { type: String },
    order_date: { type: String },
    order_time: { type: String },
    expected_delivery_date: { type: String },
    payment_method: { type: String },
    items: { type: Array },
    price_details: {
        items_amount: { type: Number },
        delivery_charge: { type: Number },
        coupen_discount: { type: Number },
        net_total: { type: Number },
        total_discount: { type: Number },
        pm_offer: { type: Number }
    },
    shipping_address: {
        email: {type: String },
        full_name: { type: String },
        mobile_number: { type: String },
        pincode: { type: String },
        address: { type: String },
        city: { type: String },
        landmark: { type: String },
        state: { type: String },
    },
    coupen_details: {
       applied: { type: Boolean },
       code: { type: String },
       discount: {
        type: { type: String },
        amount: { type: Number }
       },
       minimum: { type: Number }
    },
    order_status: { type: Boolean },
    order_progress: { type: Array },
    order_last_status: { type: String },
    online_payment_status:{ type: Boolean, default: false },
    is_order_cancelled: { type: Boolean },
    custom_tracking_url: { 
      applied: { type: Boolean, default: false },
      url: { type: String }
    },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);