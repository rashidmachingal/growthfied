import { CheckoutTemplate } from "@/interface/templates";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description: '',
}

export default function Page() {
  return (
    <>
    <Script
     id="razorpay-checkout-js"
     src="https://checkout.razorpay.com/v1/checkout.js"
    />
    <CheckoutTemplate/>
    </>
  )
}
