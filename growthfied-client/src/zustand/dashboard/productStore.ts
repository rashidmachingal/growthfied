import { create } from 'zustand'
import { EditProductTypes } from '@/types/dashboard/products'
import { BACKEND_URL } from '../../../config'

export const useEditProductDefaultDataStore = create<EditProductTypes>()((set) => ({
    fetch_status: true,
    seo: { 
      allow: false,
      meta_description: "",
      meta_title: ""
    },
    status: "",
    title: "",
    description: "",
    images: {
      image_one: "",
      image_two: "",
      image_three: "",
    },
    prev_images: {
      image_one: "",
      image_two: "",
      image_three: ""
  },
    temporary_image_urls: {
      image_one: null,
      image_two: null,
      image_three: null,
    },
    selling_price: 0,
    original_price: 0,
    discount_based_pm: {
      allow: false,
      payment_method: "online",
      selling_price: 0,
    },
    quantity: "unlimited",
    limit_per_order: {
      minimum: 0,
      maximum: 0,
    },
    delivery_days: 3,
    delivery_charge: "",
    variants: {
      variant_name: "",
      options: {
        option_one: "",
        option_two: "",
        option_three: "",
        option_four: "",
      },
      options_quantity: {
        option_one: "",
        option_two: "",
        option_three: "",
        option_four: ""
      }
    },
    accept_images: {
      allow: false,
      number: 1,
    },
    accept_message: {
      allow: false,
      label: "",
      required: false
    },
    categories: [],
    payment_methods: {
      cod: false,
      online: true,
    },
    slug: "",
    update_edit_product_default_data: (data: EditProductTypes) => {
        set(() => ({ 
            ...data,
            temporary_image_urls: {
              image_one: data.images.image_one === "no_image" ? null : `${BACKEND_URL}/public/images/products/${data.images.image_one}`,
              image_two: data.images.image_two === "no_image" ? null : `${BACKEND_URL}/public/images/products/${data.images.image_two}`,
              image_three: data.images.image_three === "no_image" ? null : `${BACKEND_URL}/public/images/products/${data.images.image_three}`,
            },
            prev_images: {
              image_one: data.images.image_one,
              image_two: data.images.image_two,
              image_three: data.images.image_three
            }
         }))
      },
      update_fetch_status: (status) => {
        set(() => ({
          fetch_status: status
        }))
      },
      update_price: (selling_price, original_price) => {
        set(()=> ({
          selling_price,
          original_price
        }))
      }
  }))

