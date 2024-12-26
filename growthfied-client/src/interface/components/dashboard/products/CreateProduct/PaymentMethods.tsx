"use client"

import React, { Dispatch, SetStateAction } from "react";
import { CheckBox, Div, Typography } from "@/interface/fragments";
import { CreateProductTypes } from "@/types/dashboard/products";

type PaymentMethodsProps = {
  setProductData: Dispatch<SetStateAction<CreateProductTypes>>
  productData: CreateProductTypes
}

export default function PaymentMethods({ productData, setProductData }: PaymentMethodsProps) {

  const handlePaymentMethod = (method: string) => {
    if(method === "online"){
      setProductData((prevData) => ({
        ...prevData,
        payment_methods: {
          online: !prevData.payment_methods.online,
          cod: prevData.payment_methods.cod
        }
      }))
    }
    if(method === "cod"){
      setProductData((prevData) => ({
        ...prevData,
        payment_methods: {
          online: prevData.payment_methods.online,
          cod: !prevData.payment_methods.cod
        }
      }))
    }
  }

  return (
    <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[10px] mt-[23px]">
      <Div className="flex flex-col">
        <Typography className="text-[13px]">Payment Methods</Typography>
        <Div
          onClick={() => handlePaymentMethod("online")}
          className="flex items-center gap-[6px] bg-gray-100 p-[10px] px-[8px] rounded-[2px] mt-[8px]"
        >
          <CheckBox
            checked={productData.payment_methods.online}
            onChange={() => {}}
          />
          <Typography className="text-[13px] cursor-pointer">
            Online Payment (3% transaction fee)
          </Typography>
        </Div>
        <Div
          onClick={() => handlePaymentMethod("cod")}
          className="flex items-center gap-[6px] bg-gray-100 p-[10px] px-[8px] rounded-[2px] mt-[10px]"
        >
          <CheckBox
            checked={productData.payment_methods.cod}
            onChange={() => {}}
          />
          <Typography className="text-[13px] cursor-pointer">
            Cash On Delivery
          </Typography>
        </Div>
      </Div>
    </Div>
  );
}
