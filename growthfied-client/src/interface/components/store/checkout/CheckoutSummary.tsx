"use client"

import { Div, PlainButton, Typography } from "@/interface/fragments";
import { useCartStore } from "@/zustand/store/cartStore";
import { usePriceStore } from "@/zustand/store/priceStore";
import { getCoupenPercentDiscount, getItemsDiscount, getSomeOfItems, getTotalPMOfferAmount } from "@/utils";
import { useEffect, useState } from "react";
import { ApplyCoupen } from "@/interface/components";

type CheckoutSummaryProps = {
  payment_method: string
}

export default function CheckoutSummary({ payment_method }: CheckoutSummaryProps) {

  const { items } = useCartStore();
  const { delivery_charge, coupen_code } = usePriceStore()

  const [isDeliveryCharge, setIsDeliveryCharge] = useState(false)
  const [itemsAmount, setItemsAmount] = useState(0)
  const [netTotal, setNetTotal] = useState(0)
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [pmOffer, setPMOffer] = useState(0)
 
  const [haveCoupen, setHaveCoupen] = useState(false)

  const getIsDeliveryChargeEnabled = () => {
    return items.some(item => item.delivery_charge === 'enable')
  }

  useEffect(() => {
    setHaveCoupen(coupen_code.applied)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, delivery_charge.loading, coupen_code])

  useEffect(() => {
    if(delivery_charge.loading === false){
      // set is delivery charge
      setIsDeliveryCharge(getIsDeliveryChargeEnabled())
      // set items amount
      setItemsAmount(getSomeOfItems(items))
      // pay online discount
      setPMOffer(getTotalPMOfferAmount(items))

      if (!getIsDeliveryChargeEnabled() && !coupen_code.applied && payment_method !== "online") {
        setNetTotal(getSomeOfItems(items))
        setTotalDiscount(0)
      }
      
      if (!getIsDeliveryChargeEnabled() && !coupen_code.applied && payment_method === "online") {
        setNetTotal(getSomeOfItems(items) - getTotalPMOfferAmount(items))
        setTotalDiscount(getTotalPMOfferAmount(items))
      }
      
      if (!getIsDeliveryChargeEnabled() && coupen_code.applied && payment_method !== "online") {
        if(coupen_code.discount.type === "fixed"){
          setNetTotal(getSomeOfItems(items) - coupen_code.discount.amount)
          setTotalDiscount(coupen_code.discount.amount)
          return
        }
        if(coupen_code.discount.type === "percentage"){
          setNetTotal(getSomeOfItems(items) - getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount))
          setTotalDiscount(getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount))
          return
        }
      }
      
      if (!getIsDeliveryChargeEnabled() && coupen_code.applied && payment_method === "online") {
        if(coupen_code.discount.type === "fixed"){
          setNetTotal(getSomeOfItems(items) - coupen_code.discount.amount - getTotalPMOfferAmount(items))
          setTotalDiscount(coupen_code.discount.amount + getTotalPMOfferAmount(items))
          return
        }
        if(coupen_code.discount.type === "percentage"){
          setNetTotal(getSomeOfItems(items) - getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount) - getTotalPMOfferAmount(items))
          setTotalDiscount(getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount) + getTotalPMOfferAmount(items))
          return
        }
      }
      
      if (getIsDeliveryChargeEnabled() && !coupen_code.applied && payment_method !== "online") {
        setNetTotal(getSomeOfItems(items) + delivery_charge.amount)
        setTotalDiscount(0)
      }
      
      if (getIsDeliveryChargeEnabled() && !coupen_code.applied && payment_method === "online") {
        setNetTotal(getSomeOfItems(items) + delivery_charge.amount - getTotalPMOfferAmount(items) )
        setTotalDiscount(getTotalPMOfferAmount(items))
      }
      
      if (getIsDeliveryChargeEnabled() && coupen_code.applied && payment_method !== "online") {
        if(coupen_code.discount.type === "fixed"){
          setNetTotal(getSomeOfItems(items) + delivery_charge.amount - coupen_code.discount.amount)
          setTotalDiscount(coupen_code.discount.amount)
          return
        }
        if(coupen_code.discount.type === "percentage"){
          setNetTotal(getSomeOfItems(items) + delivery_charge.amount - getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount))
          setTotalDiscount(getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount))
          return
        }
      }
      
      if (getIsDeliveryChargeEnabled() && coupen_code.applied && payment_method === "online") {
        if(coupen_code.discount.type === "fixed"){
          setNetTotal(getSomeOfItems(items) + delivery_charge.amount - coupen_code.discount.amount - getTotalPMOfferAmount(items))
          setTotalDiscount(coupen_code.discount.amount + getTotalPMOfferAmount(items))
          return
        }
        if(coupen_code.discount.type === "percentage"){
          setNetTotal(getSomeOfItems(items) + delivery_charge.amount - getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount) - getTotalPMOfferAmount(items))
          setTotalDiscount(getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount) + getTotalPMOfferAmount(items))
          return
        }
      }      
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupen_code, items,  payment_method, delivery_charge.amount, delivery_charge.loading])
  
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
        { pmOffer !== 0 && payment_method === "online" && (<Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Pay Online Discount</Typography>
         <Typography className="text-[15px] text-green-500" >₹{pmOffer} OFF</Typography>
        </Div>)}
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

        {haveCoupen ? (
            <Div className="w-full" >
                <ApplyCoupen total={getSomeOfItems(items) + (isDeliveryCharge ? delivery_charge.amount : 0)} className="!mt-[6px]" />
            </Div>
        ) : (
            <Div className="w-full" >
                <PlainButton onClick={()=> {
                    setHaveCoupen(true)
                }} className="text-[13px] text-blue-500" >Have coupen code?</PlainButton>
            </Div>
        )}

        

        { totalDiscount !== 0 && <Div className="w-full mt-2" >
          <Typography className="text-[13px] text-green-600 text-center" >Your Total Savings on this order ₹{Math.trunc(totalDiscount)}</Typography>
        </Div>}
    </Div>
  )
}
