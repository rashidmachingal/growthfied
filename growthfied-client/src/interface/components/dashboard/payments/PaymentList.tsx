"use client";

// fragments
import { Div, Typography } from "@/interface/fragments";

// components
import { Label } from "@/interface/components";

export default function PaymentList() {

  return (
    <Div className="mt-5 w-full rounded-theme shadow-sm">
      <Div className="w-full h-[2.3rem] border rounded-t-theme bg-[#f5f5f5] uppercase hidden md:flex items-center">
        <Div className="w-[33%] pl-10">
          <Typography className="text-[11px] font-semibold">Transaction Id</Typography>
        </Div>
        <Div className="w-[33%] text-center">
          <Typography className="text-[11px] font-semibold">Date</Typography>
        </Div>
        <Div className="w-[33%] text-center">
          <Typography className="text-[11px] font-semibold">Amount</Typography>
        </Div>
        <Div className="w-[33%] text-center">
          <Typography className="text-[11px] font-semibold">Status</Typography>
        </Div>
      </Div>

      {/* pc */}
      <Div className="hidden md:flex flex-col">
        <Div  className="w-full min-h-[2.9rem] border border-transparent border-b border-b-gray-200 flex items-center bg-white cursor-pointer hover:border">
          <Div className="w-[33%] pl-10">
            <Typography className="text-[11px]" >125650</Typography>
          </Div>
          <Div className="w-[33%] text-center">
            <Typography className="text-[11px]">25 July 2023</Typography>
          </Div>
          <Div className="w-[33%] text-center">
            <Typography className="text-[11px]">₹198</Typography>
          </Div>
          <Div className="w-[33%] flex items-center justify-center">
            <Label title="Paid" className="bg-green-200 text-green-600" />
          </Div>

        </Div>
      </Div>

      {/* mobile */}
      <Div className="flex flex-col gap-4 md:hidden">
        <Div className="w-full min-h-[2.5rem] pb-3 border border-transparent rounded pt-[5px] flex flex-col px-4 relative bg-white">
          <Div className="mt-2 flex items-center justify-between flex-wrap gap-1" >
           <Div className="flex gap-1 mt-1" >
            <Typography className="text-[11px]" >Transaction ID :</Typography>
            <Typography className="text-[11px]">125650</Typography>
           </Div>
           <Div className="flex gap-1 mt-1" >
            <Typography className="text-[11px]">25 July 2023</Typography>
           </Div>
          </Div>
          <Div className="mt-2 flex items-center  justify-between flex-wrap gap-1" >
          <Div className="flex gap-1 mt-1" >
            <Typography className="text-[11px]">₹198</Typography>
           </Div>
           <Div className="flex mt-1 gap-1" >
            <Label title="Paid" className="bg-green-200 text-green-600 px-3" />
          </Div>
          </Div>
        </Div>
      </Div>

    </Div>
  );
}
