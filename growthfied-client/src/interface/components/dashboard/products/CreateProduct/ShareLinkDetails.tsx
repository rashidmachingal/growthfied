"use client"

import { Div, InputField, Typography } from "@/interface/fragments";
import { CreateProductTypes } from "@/types/dashboard/products";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { ChangeEvent } from "react";
import { DOMAIN_NAME } from "../../../../../../config";

type ShareLinkDetailsProsp = {
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
    productData: CreateProductTypes
}

export default function ShareLinkDetails({ handleInputChange, productData }: ShareLinkDetailsProsp) {

  
  const { username } = useUserStore()

  return (
    <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[10px] mt-[23px]">
      <Div className="flex flex-col">
        <Typography className="text-[13px]">Share Link (optional)</Typography>
        <InputField
          type="text"
          name="slug"
          placeHolder="slug"
          defaultValue={productData.slug}
          containerStyle="w-full mt-[5px]"
          className="!w-full bg-gray-100 !h-[2rem] text-[13px]"
          onChange={handleInputChange}
        />
        <Typography className="text-[12px] mt-[8px] text-gray-950">
        {username}.{DOMAIN_NAME}/product/{productData.slug}
        </Typography>
      </Div>
    </Div>
  );
}
