"use client";

import { useState } from "react";
import { Div, Typography } from "@/interface/fragments";
import { NotificationIcon } from "@/interface/icons";
import OutsideClickHandler from "react-outside-click-handler";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Div className="relative">
      <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
        <Div
          onClick={handleToggle}
          className={`flex items-center cursor-pointer hover:bg-[#3a3a3aac] py-[4px] pl-[5px] pr-[5px] rounded-[4px] shadow-white  ${
            open && "bg-[#3a3a3aac]"
          } `}
        >
          <NotificationIcon className="stroke-white" />
        </Div>
        {open && (
          <Div className="w-[15rem] bg-white rounded-[4px] rounded-t-none shadow absolute right-0 z-[50] top-[52px]  border-t-[3px] border-t-black">
            <Div className="pl-2 " >
                <Typography className="font-medium text-sm" >Notifications</Typography>
            </Div>
            <Div className="w-full h-[13rem] overflow-auto style-scroll" >
                <Div className="px-2 mt-1 hover:bg-gray-100 p-1 cursor-pointer" >
                    <Typography className="text-[13px]" >You have new order for shirt</Typography>
                    <Typography className="text-[10px] text-gray-400" >1 min ago</Typography>
                </Div>
                <Div className="px-2 mt-1 hover:bg-gray-100 p-1 cursor-pointer" >
                    <Typography className="text-[13px]" >You have new order for shirt</Typography>
                    <Typography className="text-[10px] text-gray-400" >1 min ago</Typography>
                </Div>
                <Div className="px-2 mt-1 hover:bg-gray-100 p-1 cursor-pointer" >
                    <Typography className="text-[13px]" >You have new order for shirt</Typography>
                    <Typography className="text-[10px] text-gray-400" >1 min ago</Typography>
                </Div>
                <Div className="px-2 mt-1 hover:bg-gray-100 p-1 cursor-pointer" >
                    <Typography className="text-[13px]" >You have new order for shirt</Typography>
                    <Typography className="text-[10px] text-gray-400" >1 min ago</Typography>
                </Div>
            </Div>
          </Div>
        )}
      </OutsideClickHandler>
    </Div>
  );
}
