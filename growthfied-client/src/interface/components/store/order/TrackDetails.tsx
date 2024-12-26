/* eslint-disable @next/next/no-img-element */
"use client"

import { Button, Div, PlainButton, Span, Typography } from "@/interface/fragments";
import { Box, Label } from "@/interface/components";
import { TickIcon } from "@/interface/icons";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { formatDate } from "@/utils";
import Image from "next/image";
import { DOMAIN_NAME } from "../../../../../config";
import { useParams } from "next/navigation";

type TrackingDetailsProps = {
  tracking_details: any
  setIsSubmited: Dispatch<SetStateAction<boolean>>
  setIsAvailable: Dispatch<SetStateAction<boolean>>
}

export default function TrackDetails({ tracking_details, setIsSubmited, setIsAvailable }: TrackingDetailsProps) {

  const params = useParams()

  return (
    <>
    <Typography className="mt-[8px] font-medium" >Order Details - {tracking_details?.order_id}</Typography>
    <Div className="mt-[18px] flex items-start flex-col lg:flex-row gap-[15px] w-full" >
        <Box className="!rounded-none !rounded-t-theme pb-[10px] border" >
            <Div className="w-full bg-[#f5f5f5] p-[5px] pl-[8px] text-[14px] rounded-t-theme border-b" >
                <Typography className="font-medium" >ORDER STATUS</Typography>
            </Div>
            <Div className="p-[5px] mt-[3px] pl-[8px]" >  
                <Typography className="text-[12px] text-gray-600 font-medium uppercase" >Expected Delivery on</Typography>
                <Typography className="text-[12px]" >{formatDate(tracking_details?.expected_delivery_date)}</Typography>
            </Div>
            {/* <Div className="p-[5px] mt-[3px] pl-[8px]" >  
                <Typography className="text-[12px] text-gray-600 font-medium uppercase" >Payment Method</Typography>
                <Typography className="text-[12px]" >{formatDate(tracking_details?.payment_method)}</Typography>
            </Div> */}
            <Div className="p-[5px] pt-[10px] pl-[8px] flex items-center gap-2" >  
                <Typography className="text-[12px] text-gray-600 font-medium uppercase" >Status:</Typography>
                <Label title={tracking_details?.order_last_status} className={`
                  ${tracking_details?.order_last_status === "Processing" && "bg-yellow-200 text-yellow-600"} 
                  ${tracking_details?.order_last_status === "Shipped" && "bg-green-200 text-green-600"} 
                  ${tracking_details?.order_last_status === "Completed" && "bg-green-200 text-green-600"} 
                  ${tracking_details?.order_last_status === "Cancelled" && "bg-red-200 text-red-600"} 
                  ${tracking_details?.order_last_status !== "Cancelled" && tracking_details?.order_last_status !== "Completed" && tracking_details?.order_last_status !== "Shipped" && tracking_details?.order_last_status !== "Processing" && "bg-green-200 text-green-600"} 
                  px-2`
                } 
                />
            </Div>
            <Div className="p-[5px] pl-[8px]" >  
            {tracking_details?.order_progress?.slice().reverse().map((item: any, index: number) => {
                  return(
                  <Div key={index} className="flex gap-[4px]" >
                    <Div className="flex flex-col items-center" >
                     <TickIcon className="!fill-green-600" />
                     { tracking_details?.order_progress.length - 1 !== index && (<Div className="w-[2px] h-[1.5rem] bg-green-600 mt-[-3px]" />)}
                    </Div>
                    <Div className="mt-[-3px]" >
                     <Typography className="text-[12px]" >{item.status}</Typography>
                     <Typography className="text-[10px] text-gray-500" >{item.date}, {item?.time}</Typography>
                    </Div>
                   </Div>
                  )
                })}
            </Div>
        </Box>
        
        <Box className="!rounded-none !rounded-t-theme pb-[10px] border" >
            <Div className="w-full bg-[#f5f5f5] p-[5px] pl-[8px] text-[14px]  rounded-t-theme border-b" >
                <Typography className="font-medium" >SHIPPING DETAILS</Typography>
            </Div>
            <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Name</Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >{tracking_details?.shipping_address?.full_name}</Typography>
            </Div>
            <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Shipping Address</Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >
                  {tracking_details?.shipping_address?.address}, {tracking_details?.shipping_address?.landmark}, {tracking_details?.shipping_address?.city}, {tracking_details?.shipping_address?.state}
                </Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >
                  Pin: {tracking_details?.shipping_address?.pincode}
                </Typography>
            </Div>
                <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Email</Typography>
                <Div className="flex justify-between" >
                 <Typography  className="text-[11px]  md:text-[12px] text-gray-500" >{tracking_details?.shipping_address?.email}</Typography>
                </Div>
                </Div>
                <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Phone Number</Typography>
                <Div className="flex justify-between" >
                 <Typography  className="text-[11px]  md:text-[12px] text-gray-500" >+91 {tracking_details?.shipping_address?.mobile_number}</Typography>
                </Div>
                </Div>
        </Box>
    </Div>
    <Div className="mt-[10px]" >
        <Div>
            <Typography className="text-[13px]" >For any inquiries or assistance regarding your order, please feel free to reach out to us via WhatsApp.</Typography>
            <Typography className="text-[13px]" >+91 {tracking_details?.store_whatsapp_number}</Typography>
        </Div>
        <Div className="p-[5px] pl-[8px] mt-[3px] w-[10rem]" >  
          <Button type="link" url={`https://api.whatsapp.com/send?phone=+91${tracking_details?.store_whatsapp_number}`} className="!h-[1.9rem] !text-[10px] !rounded-full !bg-green-600 !text-white" >Chat on Whatsapp</Button>
        </Div>
    </Div>
    <Div className="w-full flex items-center text-[12px] mt-[18px]" >
        <Span className="w-full h-[1px] bg-gray-300" />
        <Div className="w-[25rem]" >
        <Typography className="w-full text-center text-[13px] text-gray-600" >Order Product Details</Typography>
        </Div>
        <Span className="w-full h-[1px] bg-gray-300" />
    </Div>

    {/* product details */}

    <Div className="mt-5 w-full rounded-theme shadow-sm">
      <Div className="w-full h-[2.3rem] border rounded-t-theme bg-[#f5f5f5] uppercase hidden md:flex items-center px-6 ">
        <Div className="w-[35%] text-center">
          <Typography className="text-[11px] font-semibold">Item</Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Quantity</Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Amount</Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Total Amount</Typography>
        </Div>
      </Div>

      {/* pc */}
      <Div className="hidden md:flex flex-col">
        {tracking_details?.items.map((data: any, index: number) => {
          return(
            <Div key={index} className="w-full min-h-[2.5rem] border-b flex items-center px-6 bg-white">
          <Div className="w-[35%] text-center py-2 hover:underline">
            <Div className="flex items-center gap-3" >
              <Image
                width={100}
                height={100}
                className="w-[3.5rem]"
                src={data?.image}
                alt="image"
              />
              <Link href={`http://${params?.username}.${DOMAIN_NAME}/product/${data.url}`} target="_blank" >
               <Typography className="text-[11px] cursor-pointer flex flex-col">
                {data?.title} 
                { data?.variant?.variant_name !== "" && <Span className="font-semibold" >{data?.variant?.variant_name} : {data?.variant?.selected_option}</Span>}
               </Typography>
              </Link>
            </Div>
          </Div>
          <Div className="w-[25%] text-center">
            <Typography className="text-[11px]">{data?.quantity}</Typography>
          </Div>
          <Div className="w-[25%] text-center">
            <Typography className="text-[11px]">₹{data?.selling_price}</Typography>
          </Div>
          <Div className="w-[25%] text-center">
            <Typography className="text-[11px]">₹{data?.selling_price * data?.quantity}</Typography>
          </Div>
        </Div>
          )
        })}
      </Div>

      {/* mobile */}
      <Div className="flex flex-col gap-4 md:hidden">
        {tracking_details?.items?.map((data: any, index: number) => {
          return(
         <Div key={index}  className="hover:border-black border border-transparent w-full min-h-[2.5rem] pb-3 rounded flex flex-col px-6 relative bg-white">
          <Div className="w-[90%] hover:underline">
            <Div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                width={100}
                height={100}
                className="w-[3.5rem] mt-3"
                src={data?.image}
                alt=""
              />
              <Link href={`http://${params?.username}.${DOMAIN_NAME}/product/${data.url}`} target="_blank" >
               <Typography className="text-[12px] font-medium cursor-pointer flex flex-col">
                {data?.title} 
                { data?.variant?.variant_name !== "" && <Span className="font-semibold" >{data?.variant?.variant_name} : {data?.variant?.selected_option}</Span>}
               </Typography>
              </Link>
            </Div>
          </Div>

          <Div className="flex justify-between flex-wrap gap-2" >
           <Div className="flex gap-2 mt-1" >
            <Typography className="text-xs" >Quantity :</Typography>
            <Typography className="text-[11px]">{data?.quantity}</Typography>
           </Div>
          </Div>

          <Div className="flex  flex-wrap gap-2" >
           <Div className="flex gap-2 mt-1" >
            <Typography className="text-xs" >Total Amount :</Typography>
            <Typography className="text-[11px]">₹198 x {data?.quantity} = ₹{data?.selling_price * data?.quantity}</Typography>
           </Div>
          </Div>

        
        </Div>
          )
        })}
        
      </Div>

      <Div className="w-full min-h-[2.5rem] border px-6  py-3 bg-white mt-2  flex flex-col" >

        <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Delivery Charge</Typography>
         <Typography className="text-[15px] text-gray-700" >₹{tracking_details?.price_details?.delivery_charge}</Typography>
        </Div>
        <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Items Amount(5)</Typography>
         <Typography className="text-[15px] text-gray-700" >₹{tracking_details?.price_details?.items_amount}</Typography>
        </Div>
        { tracking_details?.price_details.pm_offer !== 0 && (<Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Pay Online Discount</Typography>
         <Typography className="text-[15px] text-green-500" >₹{tracking_details?.price_details?.pm_offer}</Typography>
        </Div>)}
        { tracking_details?.coupen_details?.applied && <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Coupen Code</Typography>
         <Typography className="text-[15px] text-green-500" >{tracking_details?.coupen_details.code}, {tracking_details?.coupen_details.discount.type === "fixed" ? `₹${tracking_details?.coupen_details.discount.amount}` : `%${tracking_details?.coupen_details.discount.amount}`} </Typography>
        </Div>}
        <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Total Discount</Typography>
         <Typography className="text-[15px] text-green-500" >₹{tracking_details?.price_details?.total_discount}</Typography>
        </Div>
        <Div className="flex items-center gap-3 border-t pt-1 mt-1" >
         <Typography className="text-[14px] w-[8rem] font-medium" >Net Total Amount</Typography>
         <Typography className="text-[16px] font-medium" >₹{tracking_details?.price_details?.net_total}</Typography>
        </Div>
      </Div>

    </Div>
     <Div className="flex justify-center mt-2" >
      <PlainButton onClick={()=> {
        setIsAvailable(false)
        setIsSubmited(false)
      }} className="text-[15px] text-blue-500" >Track More</PlainButton>
      </Div>
    </>
  )
}
