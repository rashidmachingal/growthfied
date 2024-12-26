"use client";

// next
import Link from "next/link";

// react
import { useState } from "react";

// icons
import { MenuIcon } from "@/interface/icons";

// fragments
import { Div, Typography } from "@/interface/fragments";

// components
import { Logo } from "@/interface/components";

// third party modules
import OutsideClickHandler from 'react-outside-click-handler';

export default function SideDrawer() {
  const [open, setOpen] = useState(false);

  const handleDrawer = () => setOpen(prev=> !prev)

  return (
    <>
      <MenuIcon className="md:hidden" onClick={handleDrawer} />
      {open && (
        <OutsideClickHandler onOutsideClick={handleDrawer} >
        <Div className="w-[63%] bg-white h-screen border absolute left-0 top-0 z-10 md:hidden shadow-2xl">
          <Div className="w-full flex justify-center items-center shadow h-[4rem]" >
           <Logo className="mix-blend-multiply w-[8rem] xm:w-[12rem]" color="black" />
          </Div>
          <Div className="mt-5" >
           <Link onClick={handleDrawer} href="#pricing" >
            <Typography className="text-xl hover:text-primary h-12 flex items-center pl-6 w-full hover:bg-gray-100" >Pricing</Typography>
           </Link>
           <Link onClick={handleDrawer} href="#faq" >
            <Typography className="text-xl hover:text-primary h-12 flex items-center pl-6 w-full hover:bg-gray-100" >Faq</Typography>
           </Link>
           <Link onClick={handleDrawer} href="#contact" >
            <Typography className="text-xl hover:text-primary h-12 flex items-center pl-6 w-full hover:bg-gray-100" >Contact</Typography>
           </Link>
          </Div>
        </Div>
        </OutsideClickHandler>
      )}
    </>
  );
}
