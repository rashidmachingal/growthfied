"use client"

import Image from "next/image";
import { useEffect } from "react";
import { Div, Section, Typography } from "@/interface/fragments";
import { useRouter } from "next/navigation";
import FailedImage from "../../../../../../public/settings/failed.png"
import { useOrderFailedStore } from "@/zustand/store/orderFailed";

export default function OrderFailedTemplate() {

    const router = useRouter()
    const order_details = useOrderFailedStore()

    useEffect(() => {
      if(order_details.order_status) router.push("/")
    }, [order_details.order_status, router])
    
  return (
    <>
    <Section className="flex justify-center" >
        <Div className="mt-[3rem] md:mt-[5rem] lg:mt-[2rem] flex flex-col items-center w-[95%] md:w-[50%] bg-white shadow-lg rounded-[10px] border border-gray-100 p-[2rem]" >
          <Image width={0} height={0} src={FailedImage} className="w-[3rem]" alt="failed" />
          <Typography className="text-[16px] font-semibold mt-3 text-red-500 " >Order Failed!</Typography>
           <Typography className="text-[14px] font-medium text-red-500 mt-[2px]" >{order_details.message}</Typography>
           <Typography className="text-[13px] font-medium mt-[2px]" >Payment ID: {order_details.payment_id}</Typography>
           <Typography className="text-[13px] mt-[10px] text-center" >For any inquiries or assistance regarding your order, reach out to us via WhatsApp. (+91 {order_details.store_phone_number})</Typography>
        </Div>
    </Section>
    </>
  )
}