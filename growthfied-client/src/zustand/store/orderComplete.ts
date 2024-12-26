import { create } from "zustand";
import { OrderCompleteType } from "@/types/store/order";

export const useOrderCompleteStore = create<OrderCompleteType>((set) => ({
    store_name: "",
    order_status: false,
    order_id: "",
    customer_phone_number: "",
    store_phone_number: "",
    domain_name: "",
    is_domain_enabled: false,
    update_order_complete: (data: any) => {
        set((state) => ({
            order_status: data.order_status,
            store_name: data.store_name,
            order_id: data.order_id,
            customer_phone_number: data.customer_phone_number,
            store_phone_number: data.store_phone_number,
            domain_name: data.domain_name,
            is_domain_enabled: data.is_domain_enabled,
        }));
      },
}));