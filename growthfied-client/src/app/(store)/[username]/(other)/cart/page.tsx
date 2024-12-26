import { CartTemplate } from "@/interface/templates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Cart',
  description: 'View your cart and easily checkout',
}

export default function Page() {
  return <CartTemplate/>
}
