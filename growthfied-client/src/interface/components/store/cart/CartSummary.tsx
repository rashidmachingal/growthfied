"use client"

import { Button, Div, Typography } from "@/interface/fragments";
import { useCartStore } from "@/zustand/store/cartStore";
import { usePriceStore } from "@/zustand/store/priceStore";
import AlertText from "../../common/AlertText";
import { getCoupenPercentDiscount, getSomeOfItems } from "@/utils";

type CartSummaryProps = {
  itemsAmount: number
  isDeliveryCharge: boolean
  netTotal: number
  totalDiscount: number
  pmOffer: number
}

export default function CartSummary({ itemsAmount, isDeliveryCharge, netTotal, totalDiscount, pmOffer }: CartSummaryProps) {

  const { items } = useCartStore();
  const { delivery_charge, coupen_code } = usePriceStore()
  
  return (
    <Div className="w-full min-h-[2.5rem] border px-6  py-3 bg-white mt-2  flex flex-col" >
        <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Items Amount({items.length})</Typography>
         <Typography className="text-[15px] text-gray-700" >₹{itemsAmount !== undefined && <>{Math.trunc(itemsAmount)}</>}</Typography>
        </Div>
        <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Delivery Charge</Typography>
         
          { isDeliveryCharge && (
            <Typography className={`text-[15px] text-gray-700`} >
              { delivery_charge.amount === 0 ? (
                <Typography className="text-green-500" >FREE</Typography>
              ) : (
                <>₹{delivery_charge.amount}</>
              ) }
            </Typography>
          )}
          
          { delivery_charge.amount === 0 || !isDeliveryCharge && (
             <Typography className="text-green-500 text-[15px]" >FREE</Typography>
          )}
        
        </Div>
        { coupen_code.applied && <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Coupen Discount</Typography>
         <Typography className="text-[15px] text-green-500" >
          {coupen_code.discount.type === "fixed" ? coupen_code.discount.amount : getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount)} 
           {" "}OFF
         </Typography>
        </Div>}
        <Div className="flex items-center gap-3 border-t pt-1 mt-1" >
         <Typography className="text-[14px] w-[8rem] font-medium" >Net Total Amount</Typography>
         <Typography className="text-[16px] font-medium" >₹<>{Math.trunc(netTotal)}</></Typography>
        </Div>
        <Div className="w-full mt-2" >
            <Button type="link" url="/checkout" className="w-full" >Proceed to buy</Button>
        </Div>
        { totalDiscount !== 0 && <Div className="w-full mt-2" >
          <Typography className="text-[13px] text-green-600 text-center" >Your Total Savings on this order ₹{Math.trunc(totalDiscount)}</Typography>
        </Div>}
        { pmOffer !== 0 && (<AlertText
         text={`Pay Online & Save ₹${pmOffer}`}
         variant="success"
         className="mt-2 text-[12px] !h-[0.5rem]"
        />)}
    </Div>
  )
}
