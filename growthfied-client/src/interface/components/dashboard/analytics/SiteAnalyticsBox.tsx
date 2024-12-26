import { Div, Typography } from "@/interface/fragments";
import { formatVisitorCount } from "@/utils";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import Link from "next/link";
import { DOMAIN_NAME } from "../../../../../config";

type SiteAnalyticsBoxProps = {
    className?: string
    title?: string
    sub_title?: string
    data: any
}

export default function SiteAnalyticsBox({ className, title, sub_title, data }: SiteAnalyticsBoxProps) {

  const { username } = useUserStore()

  return (
    <Div className={`w-full bg-white rounded-theme min-h-[20rem] mt-2 p-2 px-[10px] ${className}`} >
        <Typography className="text-[14px] font-semibold" >{title}</Typography>
        <Div className="flex justify-between text-[12px] mt-2 font-[500] text-gray-400" >
            <Typography>{sub_title}</Typography>
            <Typography>Views</Typography>
        </Div>

        { title === "Top 15 Products" && data !== false && (
          <Div className="flex flex-col gap-[2px]" >
          {data?.map((data: any, index: number) => {
            return(
              <Link target="_blank" href={`http://${username}.${DOMAIN_NAME}${data?.dimensionValues[1]?.value}`} key={index} className="flex justify-between text-[13px] gap-[8px] mt-2 hover:bg-gray-100 p-1" >
               <Typography className="truncate" >{data?.dimensionValues[0]?.value}</Typography>
               <Typography>{formatVisitorCount(Number(data?.metricValues[0]?.value))}</Typography>
              </Link>
            )
          })}
        </Div>
      )}

        { title === "Top 15 Referals" && data !== false && (
        <Div className="flex flex-col gap-[2px]" >
          {data?.map((data: any, index: number) => {
            return(
              <Link target="_blank" href={`${data?.dimensionValues[0]?.value}`} key={index} className="flex justify-between text-[13px] gap-[8px] mt-2 hover:bg-gray-100 p-1" >
               <Typography className="truncate" >{data?.dimensionValues[0]?.value === "" ? "Direct Traffic" : data?.dimensionValues[0]?.value}</Typography>
               <Typography>{formatVisitorCount(Number(data?.metricValues[0]?.value))}</Typography>
              </Link>
            )
          })}
        </Div>
      )}
    </Div>
  )
}
