"use client"

import { useState } from "react";
import { Div, PlainButton } from "@/interface/fragments";
import { CloseButtonIcon, HamburgerIcon } from "@/interface/icons";
import Link from "next/link";

export default function StoreSideBar() {

    const [open, setOpen] = useState(false)

  return (
    <>
    <PlainButton onClick={()=> setOpen(prevData => !prevData)} className="flex md:hidden"  >
    { !open ? (<HamburgerIcon className="!w-[1.6rem] !h-[1.6rem] lg:hidden !stroke-[1px]" />) : (
        <CloseButtonIcon className="!w-[1.6rem] !h-[1.6rem] lg:hidden !stroke-[1px]" />
    )}
    </PlainButton>

    { open && (<Div className="w-full flex md:hidden fixed h-screen top-[4.6rem] left-0 z-10" >
     <Div className="w-[65%]  bg-white border-t flex flex-col px-[15px] py-[15px] gap-[15px] font-[500]" >
        <Link onClick={()=> setOpen(false)} href="/" >HOME</Link>
        <Link onClick={()=> setOpen(false)} href="/categories" >CATEGORIES</Link>
        <Link onClick={()=> setOpen(false)} href="/cart" >CART</Link>
        <Link onClick={()=> setOpen(false)} href="/track-order" >TRACK ORDER</Link>
     </Div>
     <Div onClick={()=> setOpen(false)} className="w-[35%] bg-[#000000ca]" >
     </Div>
    </Div>)}
   
    </>
  )
}
