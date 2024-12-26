const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  { 
    user_id: { type: String },
    status: { type: String },
    title: { type: String },
    description: { type: String },
    images: { 
       image_one: { type: String },
       image_two: { type: String },
       image_three: { type: String }
     },
    selling_price: { type: Number },
    original_price: { type: Number },
    discount_based_pm: {
      allow: { type: Boolean },
      payment_method: { type: String },
      selling_price: { type: Number },
   },
    quantity: { type: String },
    limit_per_order: {
       minimum: { type : Number },
       maximum: { type: Number }
    },
    delivery_days: { type: Number },
    delivery_charge: { type: String },
    variants: { 
        variant_name: { type: String },
        options: { 
          option_one: { type: String },
          option_two: { type: String },
          option_three: { type: String },
          option_four: { type: String }
        },
        options_quantity: {
          option_one: { type: Number },
          option_two: { type: Number },
          option_three: { type: Number },
          option_four: { type: Number },
        }
     },
    accept_images: {
        allow: { type: Boolean },
        number: { type: Number }
    },
    accept_message: { 
        allow: { type: Boolean },
        label: { type: String },
        required: { type: Boolean }
    },
    seo: {
      allow: { type: Boolean },
      meta_title: { type: String },
      meta_description: { type: String }
    },
    categories: [],
    payment_methods: {
        cod: { type: Boolean },
        online: { type: Boolean }
    },
    slug: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);