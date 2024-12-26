import { create } from "zustand";
import { StorePriceType } from "@/types/store/price";
import { getDefaultDeliveryChargeAndPM } from "@/@api/store/orders.api";
import { DOMAIN_NAME } from "../../../config";

export const usePriceStore = create<StorePriceType>((set) => ({
  delivery_charge: {
    loading: true,
    amount: 0,
  },
  coupen_code: {
    applied: false,
    code: "",
    discount: {
      type: "fixed",
      amount: 0,
    },
    minimum: 0
  },
  payment_method: {
    cod: true,
    online: {
      enabled: true,
      pg_name: "Razorpay"
    }
  },
  pm_offer: {
    payment_method: "online",
    discount: 0
  },
  update_pm_offer(pm, discount) {
    set(() => ({
      pm_offer: {
        payment_method: pm,
        discount: discount
      }
    }))
  },
  update_coupen: (data) => {
    set(() => ({
      coupen_code: data
    }))
  },
  update_delivery_charge: (data) => {
    set(() => ({
      delivery_charge: {
        loading: false,
        amount: data
      }
    }))
  },
  fetch_delivery_charge_and_pm: async () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      const subdomain = hostname.split(".")[0];
      const domain = hostname.split('.')[1]
      const tld = hostname.split('.')[2]
        try {
            let store_name:string = ""
            if(domain + "." + tld === DOMAIN_NAME) {
              if(subdomain !== "www") store_name = subdomain
            }else{
              store_name = domain
            }
            const res = await getDefaultDeliveryChargeAndPM(store_name);
            set(() => ({
                delivery_charge: {
                  loading: false,
                  amount: res.data.default_delivery_charge
                },
                payment_method: res.data.payment_method
            }))
          } catch (error) {
            set(() => ({
                delivery_charge: {
                  loading: false,
                  amount: 0
                }
            }))
          }
    }
  }
}));

// fetch deilvery charge & update on load
usePriceStore.getState().fetch_delivery_charge_and_pm();