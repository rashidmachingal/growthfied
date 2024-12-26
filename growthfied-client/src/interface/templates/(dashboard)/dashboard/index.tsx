"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Div, SelectDropdown, Typography } from "@/interface/fragments";
import { AlertText, AnalyticsCard, Box, OrderAnalyticsDashboard, ProfileLink } from "@/interface/components";
import { OrdersOutlineIcon, PaymentOutlineIcon, ProductsOutlineIcon, SettingsOutlineIcon, } from "@/interface/icons";
import ReactConfetti from "react-confetti";
import { useWelcomeMessage } from "@/zustand/dashboard/welcomeMessage";
import Image from "next/image";

export default function DashboardTemplate() {

  const { welcome, update_welcome } = useWelcomeMessage()

  useEffect(() => {
    if(welcome){
    const confettiDuration = 6000;
    const timeoutId = setTimeout(() => {
      update_welcome(false)
    }, confettiDuration);
    return () => clearTimeout(timeoutId);
    }
  }, [update_welcome, welcome]);

  return (
    <>
    { welcome === true && <>
      <Div className="lg:block hidden" >
       <ReactConfetti
        width={1300}
        height={700}
        numberOfPieces={250}
       />
      </Div>
      <Div className="lg:hidden block" >
       <ReactConfetti
        width={250}
        height={700}
        numberOfPieces={250}
       />
      </Div>
    </>}
    <Div className="pb-[3rem] md:pb-0" >
      {/* <Div className="pb-5 flex flex-col gap-3">
        <AlertText className="flex flex-col md:flex-row items-baseline md:items-center" variant="warning" text="You are in Trial Period , it will expire in 29 days">
          <Button type="link" url="/dashboard/subscription" className="!h-[2rem] w-full md:w-auto mt-3 md:mt-0 !bg-[#fcb617] hover:!bg-[#fcb717c6]">
            Upgrade Plan
          </Button>
        </AlertText>
        <AlertText
          className="flex flex-col lg:flex-row"
          variant="info"
          text="You need to update your bank account, for getting payment weekly"
        >
          <Button type="link" url="/dashboard/payments/add" className="!h-[2rem] w-full lg:w-auto mt-2 lg:mt-0 !bg-[#0985b7] hover:!bg-[#0986b7dc]">
            Update Payment Info
          </Button>
        </AlertText>
      </Div> */}

      <Div>
       <Typography>Welcome, to Admin Panel</Typography>
       <Box className="p-2 mt-3 !rounded-theme">
        <ProfileLink />
       </Box>
      </Div>

      {/* <Div className="flex justify-end">
        <Link href="/dashboard/analytics">
          <Typography className="mt-2 text-[13px] font-medium underline md:no-underline">
            View All Analytics
          </Typography>
        </Link>
      </Div> */}

      <OrderAnalyticsDashboard/>
      
      <Div className="mt-5" >
       <Typography>Quick Links</Typography>
       <Box className="mt-2" >
        <Link className="cursor-pointer" href="/dashboard/products/create" >
         <Div className="p-3 flex items-center gap-2 hover:border-black border border-transparent border-b-gray-200" >
          <ProductsOutlineIcon/>
         <Typography className="text-sm" >Add New Product</Typography>
         </Div>
        </Link>
        <Link className="cursor-pointer" href="/dashboard/settings/delivery-charge" >
         <Div className="border-b p-3 flex items-center gap-2 hover:border-black border border-transparent border-b-gray-200" >
          <PaymentOutlineIcon className="!w-5 !h-5" />
         <Typography className="text-sm" >Change Delivery Charge</Typography>
         </Div>
        </Link>
        <Link className="cursor-pointer" href="/dashboard/orders" >
         <Div className="border-b p-3 flex items-center gap-2 hover:border-black border border-transparent border-b-gray-200" >
          <OrdersOutlineIcon/>
         <Typography className="text-sm" >Your Orders</Typography>
         </Div>
        </Link>
        <Link className="cursor-pointer" href="/dashboard/settings" >
         <Div className="border-b p-3 flex items-center gap-2 hover:border-black border border-transparent border-b-gray-200" >
          <SettingsOutlineIcon/>
         <Typography className="text-sm" >Settings</Typography>
         </Div>
        </Link>
       </Box>
      </Div>
    </Div>
    </>
  );
}
