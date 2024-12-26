"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Div, Section, Typography } from "@/interface/fragments";
import ReactConfetti from "react-confetti";
import TickImage from "../../../../../../public/settings/tick.png"
import { useOrderCompleteStore } from "@/zustand/store/orderComplete";
import Link from "next/link";
import { DOMAIN_NAME } from "../../../../../../config";
import copy from 'copy-text-to-clipboard';
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OrderSuccessTemplate() {

    const router = useRouter()
    const order_details = useOrderCompleteStore()
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
      if(!order_details.order_status) router.push("/")
    }, [order_details.order_status, router])
    

    useEffect(() => {
        const confettiDuration = 5000;
        const timeoutId = setTimeout(() => {
          setShowConfetti(false);
        }, confettiDuration);
        return () => clearTimeout(timeoutId);
      }, []);

      const handleCopyLink = () => {
        if(order_details.is_domain_enabled) {
          navigator?.clipboard?.writeText(`http://${order_details.domain_name}/track?ph=${order_details.customer_phone_number}&order_id=${order_details.order_id}`)
          copy(`http://${order_details.domain_name}/track?ph=${order_details.customer_phone_number}&order_id=${order_details.order_id}`);
        }else{
          navigator?.clipboard?.writeText(`http://${order_details.store_name}.${DOMAIN_NAME}/track?ph=${order_details.customer_phone_number}&order_id=${order_details.order_id}`)
          copy(`http://${order_details.store_name}.${DOMAIN_NAME}/track?ph=${order_details.customer_phone_number}&order_id=${order_details.order_id}`);
        }
        toast.success("Link Copied")
      }

  return (
    <>
     {showConfetti && <ReactConfetti
       width={1300}
       height={700}
       numberOfPieces={500}
      />}
    <Section className="flex justify-center" >
        <Div className="mt-[3rem] md:mt-[5rem] lg:mt-[2rem] flex flex-col items-center w-[95%] md:w-[50%] bg-white shadow-lg rounded-[10px] border border-gray-100 p-[2rem]" >
          <Image width={0} height={0} src={TickImage} className="w-[3.8rem]" alt="" />
           <Typography className="text-[13px] mt-3 " >Thank You</Typography>
           <Typography className="text-[15px] font-medium" >Your order is confirmed</Typography>
           <Typography className="text-[16px] font-medium" >Order ID: {order_details.order_id}</Typography>
           <Typography className="text-[15px text-center mt-[10px] text-[14px]" >Order Tracking Link:</Typography>
           {order_details.is_domain_enabled ? (
            <Link href={`http://${order_details.domain_name}/track-order?ph=${order_details.customer_phone_number}&order_id=${order_details.order_id}`} className="text-[15px text-center mt-[1px] text-blue-500 text-[14px]" >https://{order_details.domain_name}/track?ph={order_details.customer_phone_number}&order_id={order_details.order_id}</Link>
           ): (
            <Link href={`http://${order_details.store_name}.${DOMAIN_NAME}/track-order?ph=${order_details.customer_phone_number}&order_id=${order_details.order_id}`} className="text-[15px text-center mt-[1px] text-blue-500 text-[14px]" >https://{order_details.store_name}.{DOMAIN_NAME}/track?ph={order_details.customer_phone_number}&order_id={order_details.order_id}</Link>
           )}
           <Button onClick={handleCopyLink} className="gap-2 mt-[12px] !h-[2rem]" >Copy Tracking Link</Button>
           <Typography className="text-[13px] mt-[15px] text-red-500 font-medium" >Important: Don&#39;t loose tracking link and Order Id</Typography>
           <Typography className="text-[13px] text-red-500 text-center font-medium" >You can track your order with about link</Typography>
           <Typography className="text-[13px] mt-[10px] text-center" >For any inquiries or assistance regarding your order, reach out to us via WhatsApp. (+91 {order_details.store_phone_number})</Typography>
        </Div>
    </Section>
    </>
  )
}