"use client"

import { Div, Section, Typography } from "@/interface/fragments";
import { ApplyCoupen, CartEmpty, CartItems, CartSummary } from "@/interface/components";
import { useCartStore } from "@/zustand/store/cartStore";
import { useEffect, useState } from "react";
import { usePriceStore } from "@/zustand/store/priceStore";
import { getSomeOfItems, getItemsDiscount, getCoupenPercentDiscount, getTotalPMOfferAmount } from "@/utils";
import { LoadingIcon } from "@/interface/icons";

export default function CartTemplate() {

  const { items } = useCartStore();
  const { delivery_charge, coupen_code } = usePriceStore()

  const [isDeliveryCharge, setIsDeliveryCharge] = useState(false)
  const [itemsAmount, setItemsAmount] = useState(0)
  const [netTotal, setNetTotal] = useState(0)
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [pmOffer, setPMOffer] = useState(0)

  const getIsDeliveryChargeEnabled = () => {
    return items.some(item => item.delivery_charge === 'enable')
  }

  useEffect(() => {
    if(delivery_charge.loading === false){
      setPMOffer(getTotalPMOfferAmount(items))
      setIsDeliveryCharge(getIsDeliveryChargeEnabled())
      setItemsAmount(getSomeOfItems(items))
      if(getIsDeliveryChargeEnabled()){
        setNetTotal(getSomeOfItems(items) + delivery_charge.amount)
      }else{
        setNetTotal(getSomeOfItems(items))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, delivery_charge.loading, coupen_code])

  useEffect(() => {
    if(delivery_charge.loading === false){
      if(coupen_code.applied){
        if(coupen_code.discount.type === "fixed"){
          setNetTotal((prevData) => (
            prevData - coupen_code.discount.amount
          ))
          setTotalDiscount(coupen_code.discount.amount)
        }
        if(coupen_code.discount.type === "percentage"){
          setNetTotal((prevData) => (
            prevData - getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount)
          ))
          setTotalDiscount(getCoupenPercentDiscount(getSomeOfItems(items), coupen_code.discount.amount))
        }
      }
    }
    

  }, [coupen_code, items, delivery_charge.amount, delivery_charge.loading])
  
  return (
    <>
    { delivery_charge.loading === false ? <Section className="px-[2rem] mt-[5.5rem] xl:px-[6rem] md:mt-[5rem] md:pt-[0.7rem] flex flex-col md:flex-row w-full md:gap-4" >
        <Div className={`w-full ${items.length !== 0 ? "md:w-[75%]" : "md:w-full"}`} >
         { items.length !== 0 ? <>
         <Typography className="font-medium" >Your Cart</Typography>
         <CartItems/>
         <ApplyCoupen 
           total={getSomeOfItems(items) + (isDeliveryCharge ? delivery_charge.amount : 0)}
         />
         </> : <>
         <CartEmpty/>
         </>}
        </Div>
          { items.length !== 0 && (
            <Div className="w-full md:w-[25%] mt-[35px]" >
            <CartSummary
             itemsAmount={itemsAmount}
             isDeliveryCharge={isDeliveryCharge}
             netTotal={netTotal} 
             totalDiscount={totalDiscount}
             pmOffer={pmOffer}
             />
        </Div>
          )}
    </Section> : (
      <Section className="w-full flex justify-center h-[calc(100vh-12rem)] items-center gap-1" >
        <LoadingIcon className="animate-spin" />
        <Typography className="text-[10px]" >Loading...</Typography>
      </Section>
    )}
    </>
  )
}