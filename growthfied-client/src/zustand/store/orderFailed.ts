import { create } from "zustand";
import { OrderFailedType } from "@/types/store/order";

export const useOrderFailedStore = create<OrderFailedType>((set) => ({
    order_status: true,
    payment_id: "",
    message: "Your order failed due to some reason, please contact support team",
    store_phone_number: "",
    update_order_failed: (data: any) => {
        set((state) => ({
            order_status: data.order_status,
            payment_id: data.payment_id,
            store_phone_number: data.store_phone_number,
            message: data.message
        }));
      },
}));