// fragments
import { Button, Div, Span, Typography } from "@/interface/fragments";

export default function PricingBox() {
  return (
    <Div className="flex flex-col lg:flex-row justify-center gap-10 mt-3 md:mt-6 w-full px-3 sm:px-8 lg:px-24 xl:px-56" >
      
      <Div className="w-full lg:w-[50%] border border-t-[7px] shadow-2xl rounded-[8px] p-5 flex flex-col" >
        <Typography variant="h3" className="font-semibold" >Grow Plan</Typography>
        <Typography className="text-3xl" >₹599<Span className="text-base" >/monthly</Span></Typography>
         <Div className="mt-3 flex flex-col gap-2" >
          <Typography>Everything you need get started, it currently offers 1 Month free trial.</Typography>
         </Div>
        <Button type="link" url="/create-store" className="mt-6" >Start for free</Button>
        <Span className="text-xs" >1 Month free-trial*</Span>
      </Div>

    </Div>
  )
}
