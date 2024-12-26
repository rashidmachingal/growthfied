export type CartItem = {
  id: string;
  url: string;
  title: string;
  image: string;
  quantity: number;
  variant: {
    variant_name: string;
    selected_option: string;
  };
  additional_message: {
    allow: boolean;
    label: string;
    message: string;
  };
  customer_photos: {
    image_one: any;
    image_two: any;
    image_three: any;
    image_four: any;
  };
  tempimg_id: any;
  limit_per_order: {
    minimum: number;
    maximum: number;
  };
  selling_price: number;
  original_price: number;
  discount_based_pm: {
    allow: boolean
    payment_method: string,
    selling_price: number,
  }
  stocks: string
  delivery_charge: string
  delivery_days: number
  payment_method: {
    cod: boolean
    online: boolean
  }
  variants_for_quanity: any
};

export type StoreCartType = {
  items: CartItem[];
  solve_conflict: (data: CartItem[]) => void;
  add_to_cart: (item: CartItem) => void;
  update_quantity: (id: string, type: "decrease" | "increase") => void;
  update_quantity_direct: (id: string, quantity: number) => void;
  update_variant: (id: string, selected_option: string) => void;
  update_additional_message: (id: string, message: string) => void;
  update_customer_photos: (id: string, photos: any) => void;
  update_tempimg_id: (id: string, tempimg_id: any) => void;
  remove_from_cart: (id: string) => void;
  clear_cart: () => void;
  add_items_local: () => void;
};

export type PhotosDataTypes = {
  images: {
    image_one: any;
    image_two: any;
    image_three: any;
    image_four: any;
  };
  temporary_image_urls: {
    image_one: string | null;
    image_two: string | null;
    image_three: string | null;
    image_four: string | null;
  };
};
