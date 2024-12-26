import { create } from "zustand";
import { CartItem, StoreCartType } from "@/types/store/cart";

export const useCartStore = create<StoreCartType>((set) => ({
  items: [],

  solve_conflict: (data: CartItem[]) => {
    set((state) => ({
      items: data
    }))
  } ,
  
  add_to_cart: (item: CartItem) => {
    set((state) => ({
      items: [...state.items, item],
    }));
  },

  update_quantity: (id: string, type: "decrease" | "increase") => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          const newQuantity = type === "increase" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    }));
  },

  update_quantity_direct: (id: string, quantity: number) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: quantity };
        }
        return item;
      }),
    }));
  },

  update_variant: (id: string, selected_option: string) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            variant: {
              variant_name: item.variant.variant_name,
              selected_option,
            },
          };
        }
        return item;
      }),
    }));
  },

  update_additional_message: (id: string, message: string) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            additional_message: {
              ...item.additional_message,
              message,
            },
          };
        }
        return item;
      }),
    }));
  },

  update_customer_photos: (id, photos) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            customer_photos: photos
          };
        }
        return item;
      }),
    }));
  },

  update_tempimg_id: (id, tempimg_id) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            tempimg_id: tempimg_id
          };
        }
        return item;
      }),
    }));
  },

  remove_from_cart: (id: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  clear_cart: () => {
    set(() => ({
      items: []
    }))
    localStorage.removeItem("cartItems")
  },

  add_items_local: () => {
    if(typeof window !== "undefined"){
      const storedItems = localStorage.getItem("cartItems")
      if(storedItems){
        const cartItems = JSON.parse(storedItems);
        set(() => ({
          items: cartItems,
        }));
      }
    }
  }
}));

useCartStore.getState().add_items_local()
