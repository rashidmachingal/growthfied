// zustand
export type OrderCompleteType = {
  order_status: boolean;
  store_name: string;
  order_id: string;
  customer_phone_number: string;
  store_phone_number: string;
  domain_name: string;
  is_domain_enabled: boolean;
  update_order_complete: (data: any) => void;
};

// zustand
export type OrderFailedType = {
  order_status: boolean;
  payment_id: string;
  store_phone_number: string;
  message: string;
  update_order_failed: (data: any) => void;
};
