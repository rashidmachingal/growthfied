export type StorePriceType = {
  delivery_charge: {
    loading: boolean;
    amount: number;
  };
  coupen_code: {
    applied: boolean;
    code: string;
    discount: {
      type: "fixed" | "percentage";
      amount: number;
    };
    minimum: number
  };
  payment_method: {
    cod: boolean,
    online: {
      enabled: boolean
      pg_name: String
    }
  },
  pm_offer: {
    payment_method: string,
    discount: number
  },
  update_pm_offer: (pm: string, discount: number) => void
  update_delivery_charge: (data: number) => void;
  update_coupen: (data: StorePriceType["coupen_code"]) => void
  fetch_delivery_charge_and_pm: () => void;
};
