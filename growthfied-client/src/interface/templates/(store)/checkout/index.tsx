"use client"

import { useEffect, useState } from "react";
import { Div, Main, Span, Typography } from "@/interface/fragments";
import { CheckoutAddress, SelectPaymentMethod } from "@/interface/components";
import { CheckoutAddressType } from "@/types/store/checkout";
import { useCartStore } from "@/zustand/store/cartStore";
import { useRouter } from "next/navigation";

export default function CheckoutTemplates() {

    const router = useRouter()
    const { items } = useCartStore()

    const initialCheckoutAddress = {
     email: "",
     full_name: "",
     mobile_number: "",
     pincode: "",
     address: "",
     city: "",
     landmark: "",
     state: "Kerala",
   };

    const [step, setStep] = useState< "delivery_address" | "payment_method" >("delivery_address")
    const [checkoutAddress, setCheckoutAddress] = useState<CheckoutAddressType>(initialCheckoutAddress);

    useEffect(() => {
      if(items.length === 0) router.push("/cart")
      const localStorageAddress = localStorage.getItem("checkoutAddress")
      if(localStorageAddress !== null){
        setCheckoutAddress(JSON.parse(localStorageAddress))
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

  return (
    <>
    <Main className="flex flex-col items-center pt-[0.8rem] mt-[5.5rem]" >
      <Div className="flex items-center gap-3 w-full md:w-auto px-[6px] md:px-0" >
       <Div className={`flex items-center justify-center gap-2 w-[100%] md:w-[10rem] bg-gray-50 p-2 px-3 shadow border-2 rounded-[50px] ${step === "delivery_address" && "border-primary"}`} >
        <Typography className="text-[10px] md:text-[13px] text-center" >Shipping Address </Typography>
       </Div>
       <Div className="flex items-center" >
        <Span className="w-[3rem] md:w-[8rem] h-[2px] bg-gray-200 rouned-full" />
       </Div>
       <Div className={`flex items-center justify-center gap-2 w-[100%] md:w-[10rem] bg-gray-50 p-2 px-3 shadow border-2 rounded-[50px] ${step === "payment_method" && "border-primary"}`} >
        <Typography className="text-[10px] md:text-[13px] text-gray-600 text-center" >Payment Method</Typography>
       </Div>
     </Div>
       <Div className="mt-5 w-full" >
        { step === "delivery_address" && <CheckoutAddress checkoutAddress={checkoutAddress} setCheckoutAddress={setCheckoutAddress} setStep={setStep} /> }
        { step === "payment_method" && <SelectPaymentMethod checkoutAddress={checkoutAddress} setStep={setStep} /> }
       </Div>
    </Main>
    </>
  )
}
