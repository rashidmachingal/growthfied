"use client"

import { Dispatch, SetStateAction } from "react";
import { Div, PlainButton } from "@/interface/fragments";
import { useCartStore } from "@/zustand/store/cartStore";
import { CartItem } from "@/types/store/cart";
import { CreateProductTypes } from "@/types/dashboard/products";
import { toast } from "sonner";
import { ExclamationIcon } from "@/interface/icons";

export type VariantType = {
  variant_name: string;
  selected_option: string;
}

type VariantsSelectProps = {
  id: any
  variants: {
    option_one: string,
    option_two: string,
    option_three: string,
    option_four: string
  }
  selected_variant: VariantType
  variant_name: string
  setVariants: Dispatch<SetStateAction<{
    variant_name: string;
    selected_option: string;
  }>>
  addedToCart: boolean
  product: CreateProductTypes & {
    _id?: string;
  }
  quantity: number
  setQuantity: Dispatch<SetStateAction<number>>
}

export default function VariantsSelect({ id, selected_variant, variants, variant_name, setVariants, addedToCart, product, quantity, setQuantity }: VariantsSelectProps) {

  const { update_variant, update_quantity_direct } = useCartStore()

  const handleVariantSelect = (option: string, index: number) => {

    // if quantity more than available option quanity
    if(index === 0){
      if(quantity > product.variants.options_quantity.option_one  && product.variants.options_quantity.option_one > 0){
        update_quantity_direct(id, product.variants.options_quantity.option_one)
        setQuantity(product.variants.options_quantity.option_one)
        if(addedToCart){
          const storedItems = localStorage.getItem("cartItems");
      if (storedItems) {
        const prevItems = JSON.parse(storedItems);
        const updatedItems = prevItems.map((item: CartItem) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: product.variants.options_quantity.option_one,
            };
          }
          return item;
        });
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      }
        }
        toast.error(`Alert: Quantity decreased!`, { icon: <ExclamationIcon className="!fill-yellow-500" /> })
      }
    }
    
    if(index === 1){
      if(quantity > product.variants.options_quantity.option_two && product.variants.options_quantity.option_two > 0){
        update_quantity_direct(id, product.variants.options_quantity.option_two)
        setQuantity(product.variants.options_quantity.option_two)
        if(addedToCart){
          const storedItems = localStorage.getItem("cartItems");
      if (storedItems) {
        const prevItems = JSON.parse(storedItems);
        const updatedItems = prevItems.map((item: CartItem) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: product.variants.options_quantity.option_two,
            };
          }
          return item;
        });
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      }
        }
        toast.error(`Alert: Quantity decreased!`, { icon: <ExclamationIcon className="!fill-yellow-500" /> })
      }
    }
    if(index === 2){
      if(quantity > product.variants.options_quantity.option_three  && product.variants.options_quantity.option_three > 0){
        update_quantity_direct(id, product.variants.options_quantity.option_three)
        setQuantity(product.variants.options_quantity.option_three)
        if(addedToCart){
          const storedItems = localStorage.getItem("cartItems");
      if (storedItems) {
        const prevItems = JSON.parse(storedItems);
        const updatedItems = prevItems.map((item: CartItem) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: product.variants.options_quantity.option_three,
            };
          }
          return item;
        });
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      }
        }
        toast.error(`Alert: Quantity decreased!`, { icon: <ExclamationIcon className="!fill-yellow-500" /> })
      }
    }
    if(index === 3){
      if(quantity > product.variants.options_quantity.option_four  && product.variants.options_quantity.option_four > 0){
        update_quantity_direct(id, product.variants.options_quantity.option_four)
        setQuantity(product.variants.options_quantity.option_four)
        if(addedToCart){
          const storedItems = localStorage.getItem("cartItems");
      if (storedItems) {
        const prevItems = JSON.parse(storedItems);
        const updatedItems = prevItems.map((item: CartItem) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: product.variants.options_quantity.option_four,
            };
          }
          return item;
        });
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      }
        }
        toast.error(`Alert: Quantity decreased!`, { icon: <ExclamationIcon className="!fill-yellow-500" /> })
      }
    }

    if(addedToCart){
      if(index === 0){
        if(product.variants.options_quantity.option_one <= 0){
          return toast.error(`${product.variants.options.option_one} is currently out of stock!`,
            { icon: <ExclamationIcon className="!fill-yellow-500" /> })
        }
      }
      if(index === 1){
        if(product.variants.options_quantity.option_two <= 0){
          return toast.error(`${product.variants.options.option_two} is currently out of stock!`,
            { icon: <ExclamationIcon className="!fill-yellow-500" /> })
        }
      }
      if(index === 2){
        if(product.variants.options_quantity.option_three <= 0){
          return toast.error(`${product.variants.options.option_three} is currently out of stock!`,
            { icon: <ExclamationIcon className="!fill-yellow-500" /> })
        }
      }
      if(index === 3){
        if(product.variants.options_quantity.option_four <= 0){
          return toast.error(`${product.variants.options.option_four} is currently out of stock!`,
            { icon: <ExclamationIcon className="!fill-yellow-500" /> })
        }
      }
      setVariants({
        variant_name: variant_name,
        selected_option: option
      })
      update_variant(id, option)
    }else{
      setVariants({
        variant_name: variant_name,
        selected_option: option
      })
    }

    const storedItems = localStorage.getItem("cartItems");
    if(storedItems){
      const prevItems = JSON.parse(storedItems);
      const updatedItems = prevItems.map((item: CartItem) => {
        if (item.id === id) {
          return {
            ...item,
            variant: {
              variant_name: item.variant.variant_name,
              selected_option: option
            },
          };
        }
        return item;
      })
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }
  }

  return (
    <Div className="flex gap-2 flex-wrap" >
        {variants?.option_one !== "" && (
          <PlainButton onClick={()=> handleVariantSelect(variants?.option_one, 0)} className={`${selected_variant.selected_option === variants.option_one ? "bg-black !text-white" : "bg-gray-50"} select-none min-w-[3rem] h-[2.3rem] border border-gray-200 hover:bg-primary hover:text-white shadow-sm hover:border-primary cursor-pointer px-[5px] flex items-center justify-center text-[13px] rounded-theme`} >
           {variants?.option_one}
          </PlainButton>
        )}

        {variants?.option_two !== "" && (
          <PlainButton onClick={()=> handleVariantSelect(variants?.option_two, 1)} className={`${selected_variant.selected_option === variants.option_two ? "bg-black !text-white" : "bg-gray-50"} select-none min-w-[3rem] h-[2.3rem] border border-gray-200 hover:bg-primary hover:text-white shadow-sm hover:border-primary cursor-pointer px-[5px] flex items-center justify-center text-[13px] rounded-theme`} >
            {variants?.option_two}
          </PlainButton>
        )}

        {variants?.option_three !== "" && (
          <PlainButton onClick={()=> handleVariantSelect(variants?.option_three, 2)} className={`${selected_variant.selected_option === variants.option_three ? "bg-black !text-white" : "bg-gray-50"} select-none min-w-[3rem] h-[2.3rem] border border-gray-200 hover:bg-primary hover:text-white shadow-sm hover:border-primary cursor-pointer px-[5px] flex items-center justify-center text-[13px] rounded-theme`} >
            {variants?.option_three}
          </PlainButton>
        )}

        {variants?.option_four !== "" && (
          <PlainButton onClick={()=> handleVariantSelect(variants?.option_four, 3)} className={`${selected_variant.selected_option === variants.option_four ? "bg-black !text-white" : "bg-gray-50"} select-none min-w-[3rem] h-[2.3rem] border border-gray-200 hover:bg-primary hover:text-white shadow-sm hover:border-primary cursor-pointer px-[5px] flex items-center justify-center text-[13px] rounded-theme`} >
            {variants?.option_four}
          </PlainButton>
        )}
        
    </Div>
  )
}
