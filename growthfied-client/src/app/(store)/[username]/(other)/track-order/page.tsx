import { Metadata } from "next";
import { EnterTrackTemplate } from "@/interface/templates";

export const metadata: Metadata = {
  title: 'Track Order',
  description: 'Track your order and stay updated on its status',
}

export default function Page() {
  return <EnterTrackTemplate/>
}
