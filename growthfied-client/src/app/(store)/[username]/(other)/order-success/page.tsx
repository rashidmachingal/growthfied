import { OrderSuccessTemplate } from "@/interface/templates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Order Success',
  description: '',
}

export default function Page() {
  return <OrderSuccessTemplate/>
}
