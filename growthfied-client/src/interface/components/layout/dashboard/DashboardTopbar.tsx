"use client"

// next
import Link from "next/link";

// react
import { Dispatch, SetStateAction } from "react";

// fragments
import { Div, Nav } from "@/interface/fragments";

// icons
import { HamburgerIcon } from "@/interface/icons";

// components
import { Logo, NotificationDropdown, ProfileDropdown } from "@/interface/components";

type DashboardTopbarProps = {
  setToggleSidebar: Dispatch<SetStateAction<boolean>>
  toggleSidebar: boolean
}

export default function DashboardTopbar({ toggleSidebar, setToggleSidebar }: DashboardTopbarProps) {
  return (
    <Nav className="h-[4.2rem] px-3 lg:px-10 flex items-center justify-between bg-[#171717] fixed w-full top-0 z-50">
      <Div className="flex items-center gap-3" >
        <Div onClick={()=> setToggleSidebar(prev=> !prev)} className={`flex items-center cursor-pointer py-[4px] pl-[5px] pr-[5px] rounded-[4px] shadow-white ${
            toggleSidebar && "bg-[#3a3a3aac]"
          } `} >
         <HamburgerIcon className="stroke-white vmd:hidden" />
      </Div>
      <Link href="/dashboard">
        <Logo
          className=" w-[7rem]"
          color="white"
        />
      </Link>
      </Div>
      <Div className="flex items-center gap-4" >
       <ProfileDropdown/>
      </Div>
    </Nav>
  );
}
