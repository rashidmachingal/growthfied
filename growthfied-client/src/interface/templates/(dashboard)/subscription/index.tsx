"use client";

// fragments
import { Button, Div, Span, Typography } from "@/interface/fragments";

// components
import { AlertText, Box, PageHeader } from "@/interface/components";

// icons
import { TickIcon } from "@/interface/icons";

export default function SubscriptionTemplate() {

  return (
    <>
      <PageHeader title="Subscription" />
      <Div className="mt-3 flex flex-col gap-2">
        <AlertText className="flex flex-col md:flex-row items-baseline md:items-center" variant="warning" text="Your free trail ends in 7 day">
          <Button className="!h-[2rem] w-full md:w-auto mt-3 md:mt-0 !bg-[#fcb617] hover:!bg-[#fcb717c6]">
            Upgrade Plan
          </Button>
        </AlertText>

        <Div className="w-full mt-5 lg:w-[50%] min-h-56 border border-t-[7px] bg-white rounded-[8px] p-5 flex flex-col" >
        <Typography variant="h3" className="font-semibold text-[16px]" >Grow Plan</Typography>
        <Typography className="text-[18px]" >₹99<Span className="text-base" >/monthly</Span></Typography>
         <Div className="mt-3 flex flex-col gap-2" >
         <Div className="flex gap-1 items-center" >
          <Div><TickIcon className="fill-primary mt-[2px] w-4 h-4" /></Div>
          <Typography className="text-[14px]" >List your products on your growthfied profile</Typography>
         </Div> 
         <Div className="flex gap-1" >
           <Div><TickIcon className="fill-primary mt-[2px] w-4 h-4" /></Div>
          <Typography className="text-[14px]" >Manage products and orders through admin panel</Typography>
         </Div>
         <Div className="flex gap-1" >
           <Div><TickIcon className="fill-primary mt-[2px] w-4 h-4" /></Div>
           <Typography className="text-[14px]" >Enables online payments (3% transaction fee)</Typography>
          </Div>
          <Div className="flex gap-1" >
           <Div><TickIcon className="fill-primary mt-[2px] w-4 h-4" /></Div>
           <Typography className="text-[14px]" >Discounts with promo codes</Typography>
          </Div>
          <Div className="flex gap-1" >
           <Div><TickIcon className="fill-primary mt-[2px] w-4 h-4" /></Div>
           <Typography className="text-[14px]" >Accept images and additional info from customers</Typography>
          </Div>
          <Div className="flex gap-1" >
           <Div><TickIcon className="fill-primary mt-[2px] w-4 h-4" /></Div>
           <Typography className="text-[14px]" >And more features...</Typography>
          </Div>
         </Div>
        <Button className="mt-6" >Start for free</Button>
      </Div>

        <Box className="mt-3 p-[13px] flex justify-between items-center">
          <Typography className="text-[13px] font-medium text-green-500">
            Your grow plan subscription is now active
          </Typography>
          <Button className="text-[13px] font-medium">
            Cancel
          </Button>
        </Box>

        <Box className="mt-3 p-[13px] flex justify-between items-center">
          <Typography className="text-[13px] font-medium">
            Do you want e-commerce store with custom domain name rashileo.com ?
          </Typography>
          <Button className="text-[13px] font-medium">
            Contact
          </Button>
        </Box>
      </Div>
    </>
  );
}
