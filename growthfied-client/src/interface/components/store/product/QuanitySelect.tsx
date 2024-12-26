"use client"

import { Dispatch, SetStateAction } from "react";
import { Div, PlainButton } from "@/interface/fragments";
import { useCartStore } from "@/zustand/store/cartStore";
import { toast } from "sonner";
import { ExclamationIcon } from "@/interface/icons";
import { CartItem } from "@/types/store/cart";
import { CreateProductTypes } from "@/types/dashboard/products";
import { VariantType } from "./VariantsSelect";

type QuantitySelectProps = {
  className?: string
  quanity: number
  setQuantity?: Dispatch<SetStateAction<number>>
  limit_per_order: any
  id: any
  stocks: string
  variants_for_quanity: any
  variants: VariantType
}

export default function QuanitySelect({ className, quanity, setQuantity, limit_per_order, id, stocks, variants_for_quanity, variants }: QuantitySelectProps) {

   const { update_quantity } = useCartStore()

   const handleQuantity = (type: "decrease" | "increase") => {
    if(type === "decrease") {
      if(limit_per_order.minimum === quanity) return toast.error(`Minimum quantity required ${limit_per_order.minimum}`,
        { icon: <ExclamationIcon className="!fill-yellow-500" /> })
      if(setQuantity) setQuantity(prev => prev - 1)
      update_quantity(id, "decrease")

      const storedItems = localStorage.getItem("cartItems");
      if (storedItems) {
        const prevItems = JSON.parse(storedItems);
        const updatedItems = prevItems.map((item: CartItem) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        });
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      }

    }


    if(type === "increase") {
      if(variants_for_quanity.variant_name === ""){
        if(quanity === Number(stocks)) return toast.error(`Only ${quanity} stocks available!`)
      }

      if(variants_for_quanity.variant_name !== ""){
        if(variants.selected_option === variants_for_quanity.options.option_one && variants_for_quanity.options_quantity.option_one === quanity){
          return toast.error(`Only ${quanity} stocks available for ${variants_for_quanity.options.option_one}!`)
        }
        if(variants.selected_option === variants_for_quanity.options.option_two && variants_for_quanity.options_quantity.option_two === quanity){
          return toast.error(`Only ${quanity} stocks available for ${variants_for_quanity.options.option_two}!`)
        }
        if(variants.selected_option === variants_for_quanity.options.option_three && variants_for_quanity.options_quantity.option_three === quanity){
          return toast.error(`Only ${quanity} stocks available for ${variants_for_quanity.options.option_three}!`)
        }
        if(variants.selected_option === variants_for_quanity.options.option_four && variants_for_quanity.options_quantity.option_four === quanity){
          return toast.error(`Only ${quanity} stocks available for ${variants_for_quanity.options.option_four}!`)
        }
      }

      if(limit_per_order.maximum === quanity) return toast.error("Maximum quantity reached!")
      if(setQuantity) setQuantity(prev => prev + 1)
      update_quantity(id, "increase")
      
      const storedItems = localStorage.getItem("cartItems");
      if (storedItems) {
        const prevItems = JSON.parse(storedItems);
        const updatedItems = prevItems.map((item: CartItem) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      }
    }
   }

  return (
    <Div className={`flex items-center border bg-white border-[#333333da] h-[2.2rem] w-[50%] mmd:w-[40%] justify-between rounded-theme ${className}`} >
      <PlainButton onClick={()=> handleQuantity("decrease")} className="cursor-pointer w-[2.5rem] text-[25px] font-light flex items-center justify-center bg-gray-100 hover:bg-gray-200 border-r hover:border-[#333333da] h-full rounded-l-[5px]" >
          -
      </PlainButton>
        <Div className="w-[2.5rem] flex items-center justify-center h-theme text-[16px]" >{quanity}</Div>
      <PlainButton onClick={()=> handleQuantity("increase")} className="cursor-pointer w-[2.5rem] text-[20px] font-light flex items-center justify-center bg-gray-100 hover:bg-gray-200 border-l hover:border-[#333333da] h-full rounded-r-[5px]" >
          +
      </PlainButton>
    </Div>
  )
}
