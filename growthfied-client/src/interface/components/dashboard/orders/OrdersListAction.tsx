// fragments
import { Div, Typography } from "@/interface/fragments";

type OrdersListActionProps = {
  className?: string
}

export default function OrdersListAction({ className }: OrdersListActionProps) {
  return (
    <>
     <Div className={`w-[12rem] bg-white absolute right-[10px] top-[30px] border rounded-theme flex flex-col p-[8px] gap-[3px] ${className}`}>
      <Div className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">View Details</Typography>
      </Div>
      <Div className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">Update Status</Typography>
      </Div>
    </Div>
    </>
  );
}
