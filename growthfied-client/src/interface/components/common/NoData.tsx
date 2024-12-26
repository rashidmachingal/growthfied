import Image from "next/image";
import { Div, Typography } from "@/interface/fragments";
import NoDataImage from "../../../../public/settings/no-data.png"

type NoDataProps = {
    className?: string
    title: string
    description?: string
}

export default function NoData({ className, title, description }: NoDataProps) {
  return (
    <Div className={`w-full h-[25rem] bg-white rounded-[6px] flex flex-col items-center justify-center ${className}`} >
        <Image src={NoDataImage} width={120} height={120} alt="no data image" />
        <Typography className="font-medium mt-3 text-center" variant="h5" >{title}</Typography>
        <Typography className="text-[13px] text-center mt-2" >{description}</Typography>
    </Div>
  )
}
