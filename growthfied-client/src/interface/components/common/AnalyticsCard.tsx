import { Div, Typography } from '@/interface/fragments'
import { AnalyticsFillIcon, ReportIcon, RupeeIcon } from '@/interface/icons'

type DashboardCardTypes = {
    count: number | string
    title: string
    className?: string
    iconName: "report" | "earning" | "analytics"
}

export default function DashboardCard({ count, title, className, iconName }: DashboardCardTypes) {
    return (
        <Div className="flex items-center w-full h-[5rem] bg-white rounded-theme p-4 gap-5">
           <Div className={`bg-[#e8f7ff] w-12 h-12 rounded-full flex items-center cursor-pointer justify-center text-white font-bold ${className}`}>
              { iconName === "report" && <ReportIcon className='fill-[#1e84d5]' />}
              { iconName === "earning" &&  <RupeeIcon className='fill-[#1e84d5]' />}
              { iconName === "analytics" &&  <AnalyticsFillIcon className='fill-[#1e84d5]' />}
           </Div>
            <Div>
              <Typography className="font-[600]">{count}</Typography>
              <Typography className="!text-[13px]">{title}</Typography>
            </Div>
        </Div>
    )
}