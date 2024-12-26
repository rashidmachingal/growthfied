import { Div, PlainButton } from "@/interface/fragments";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AnalyticsBarProps = {
  currentPage: string
}

export default function AnalyticsBar({ currentPage }: AnalyticsBarProps) {

  return (
    <>
    <Div className="flex items-center gap-[10px] h-[2.8rem] border-b  overflow-auto" >
      <Link href="/dashboard/analytics/site"  className={`${currentPage === "Site" ? 'border-b-black font-[600]' : 'border-b-transparent text-gray-500 font-[500]'} border-b-[2px] h-full flex text-[14px] w-[8rem] justify-center`} >
        <PlainButton>Site Analytics</PlainButton>
      </Link>
      <Link href="/dashboard/analytics/order" className={`${currentPage === "Order" ? 'border-b-black font-[600]' : 'border-b-transparent text-gray-500 font-[500]'} border-b-[2px] h-full flex text-[14px] w-[8rem] justify-center`} >
        <PlainButton>Order Analytics</PlainButton>
      </Link>
    </Div>
    </>
  )
}
