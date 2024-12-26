"use client"

import { Div } from "@/interface/fragments"
import { ShoppingCarticon } from "@/interface/icons"
import { useCartStore } from "@/zustand/store/cartStore"

export default function CartCount() {

  const { items } = useCartStore();

  return (
    <Div className="relative" >
        {items.length !== 0 && (<Div className="absolute bottom-[5px] right-[3px] w-[17px] h-[17px] bg-primary rounded-full flex items-center justify-center text-white text-[12px]" >
        {items.length}
        </Div>)}
        <ShoppingCarticon className="!w-[38px] !h-[38px]" />
    </Div>
  )
}
