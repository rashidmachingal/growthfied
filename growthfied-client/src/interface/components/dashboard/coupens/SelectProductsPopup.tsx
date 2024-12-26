"use client"

import { Button, CheckBox, Div, Typography } from "@/interface/fragments";
import { Popup } from "@/interface/components";

type SelectProductsProps = {
  open: boolean
  onClose:  () => void
}

export default function SelectProducts({ open, onClose }: SelectProductsProps) {


  return (
    <Popup open={open} onClose={onClose}>
      <Div className="w-[95vw] lg:w-[50vw] shadow  bg-white rounded-theme p-5 pt-4">
        <Div className="flex items-center justify-between border-b pb-2">
          <Typography className="font-medium">Select Products</Typography>
        </Div>
        <Div className="flex flex-wrap items-start mt-5 gap-4 w-full h-[15rem] overflow-auto style-scroll pr-3">
           <Div className="w-full flex  gap-[1rem] border hover:bg-gray-100 px-[10px] pr-[1rem] rounded-[5px]" >
            <Div className="flex items-center" >
             <CheckBox />
            </Div>
            <Div className="flex items-center w-full justify-between" >
            <Div className="text-center py-2 hover:underline">
            <Div className="flex items-center gap-3">
              <img
                className="w-10"
                src="https://rash-cart.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F2.9419a980.png&w=640&q=75"
                alt=""
              />
              <Typography className="text-[11px] cursor-pointer">
                Alen Solly Cotton Short Sleev T-Shirt Gray 500
              </Typography>
            </Div>
            </Div>
            <Div>
              <Typography className="text-[15px]" >₹198</Typography>
            </Div>
            </Div>
           </Div>
        </Div>
        <Div className="mt-[30px] flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="!h-[2rem] w-[5rem] border-black !bg-gray-200 hover:!bg-gray-300 !text-black"
          >
            Close
          </Button>
          <Button className="!h-[2rem] ">Done</Button>
        </Div>
      </Div>
    </Popup>
  );
}
