"use client"

import { Button, Div, Typography } from "@/interface/fragments";
import { Popup } from "@/interface/components";
import { LoadingIcon } from "@/interface/icons";
import { CartItem } from "@/types/store/cart";
import { useCartStore } from "@/zustand/store/cartStore";
import { useRouter } from "next/navigation";
import { usePriceStore } from "@/zustand/store/priceStore";

type DeleteConfirmPopupProps = {
  title: string
  open: boolean
  loading: boolean
  content: string
  type: string
  updatedCart: CartItem[]
  updatedDeliveryCharge: number
  onClose:  () => void
}

export default function OrderConflictPopup({ open, onClose, loading, title, content, type, updatedCart, updatedDeliveryCharge }: DeleteConfirmPopupProps) {

  const { solve_conflict } = useCartStore()
  const { delivery_charge, update_delivery_charge, update_coupen } = usePriceStore()
  const router = useRouter()

  const handleRemove = async () => {
    if(type === "CODE1" || type === "CODE2"){
      const cleanedData = updatedCart.filter(item => item !== null);
      solve_conflict(cleanedData)
      const storedItems = localStorage.getItem("cartItems")
      if(storedItems) localStorage.setItem("cartItems", JSON.stringify(cleanedData))
      if(delivery_charge.amount !== updatedDeliveryCharge){
        update_delivery_charge(updatedDeliveryCharge)
      }
    }
    if(type === "CODE3") {
      update_delivery_charge(updatedDeliveryCharge)
    }
    if(type === "CODE4" || type === "CODE5" || type === "CODE6"){
      update_coupen({
        applied: false,
        code: "",
        discount: {
          amount: 0,
          type: "fixed"
        },
        minimum: 0
      })
      if(delivery_charge.amount !== updatedDeliveryCharge){
        update_delivery_charge(updatedDeliveryCharge)
      }
    }
    router.push("/cart")
    onClose();
  };

  return (
    <Popup open={open} >
      <Div className="w-[95vw] lg:w-[35vw] shadow  bg-white rounded-theme p-5 pt-4">
        <Div className="flex items-center justify-between border-b pb-2">
          <Typography className="font-medium">{title}</Typography>
        </Div>
        <Div className="flex flex-col pl-1 pb-2 gap-[8px] w-full overflow-auto style-scroll pr-3 mt-[8px]">
            <Typography>{content}</Typography>
        </Div>
        <Div className="mt-[30px] flex justify-end gap-3">
          <Button onClick={handleRemove} disabled={loading} className="!h-[2rem] !w-[8rem] !bg-red-600">
           {loading ? <LoadingIcon className="animate-spin" /> : "Update Cart"}
          </Button>
        </Div>

      </Div>
    </Popup>
  );
}
