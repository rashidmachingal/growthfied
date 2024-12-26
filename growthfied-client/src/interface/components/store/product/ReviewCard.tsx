// fragments
import { Div, Typography } from "@/interface/fragments";
import { StarFillIcon, UserFillIcon } from "@/interface/icons";

export default function ReviewsCard() {
  return (
    <Div className="shadow rounded-theme w-[95%] md:w-[25rem] bg-white px-[5px] py-[5px]" >
      <Div>
        <Div className="flex items-center gap-[4px]" >
          <UserFillIcon className="w-[2rem] h-[2rem] fill-gray-300" />
          <Typography className="text-[13px]" >John Doe</Typography>
        </Div>
        <Div className="flex items-center px-[8px] mt-[4px] gap-1" >
          <Typography className="text-[12px]" >5</Typography>
          <StarFillIcon className="fill-yellow-500" />
        </Div>
        <Div className="px-[8px] mt-[3px]" >
          <Typography className="text-[12px]" >
            An excellent gym shirt! It keeps me
            dry, and the fit is spot-on. I highly
            recommend it.
          </Typography>
        </Div>
      </Div>
    </Div>
  )
}
