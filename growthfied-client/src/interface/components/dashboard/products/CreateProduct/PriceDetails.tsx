"use client"

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Div, InputField, Typography } from "@/interface/fragments";
import { CreateProductTypes } from "@/types/dashboard/products";
import { getProductDiscountPercentage } from "@/utils";

type PriceDetailsProps = {
    productData: CreateProductTypes
    setProductData: Dispatch<SetStateAction<CreateProductTypes>>
    formErrors: any
    setFormErrors: Dispatch<any>
}

export default function PriceDetails({ setProductData, formErrors, setFormErrors, productData }: PriceDetailsProps) {


    const handlePriceChange = (e:  ChangeEvent<HTMLInputElement>) => {
      if (formErrors !== undefined) {
        const { [e.target.name]: _, ...rest } = formErrors;
        setFormErrors(rest);
      }

      setProductData((prevData) => ({
        ...prevData,
        [e.target.name]: Math.abs(Number(e.target.value)),
      }));
      }

  return (
    <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[1rem] pt-[3px] mt-[1rem]">
      <Div className="flex flex-col lg:flex-row gap-5 lg:gap-6 mt-[0.5rem]">
        <InputField
          label="Selling Price"
          name="selling_price"
          type="number"
          placeHolder="0.00"
          innerText="₹"
          innerTextStyle="left-3 mt-[3px]"
          containerStyle="w-full mt-[5px] lg:mt-0"
          className="!w-full bg-gray-100 mt-[2px] pl-[25px]"
          onChange={handlePriceChange}
          invalid={!!formErrors?.selling_price}
          errorMessage={formErrors?.selling_price}
        />
        <InputField
          label="Original Price (optional)"
          name="original_price"
          type="number"
          placeHolder="00"
          innerText="₹"
          innerTextStyle="left-3 mt-[3px]"
          containerStyle="w-full"
          className="!w-full bg-gray-100 mt-[2px] pl-[25px]"
          onChange={handlePriceChange}
          invalid={!!formErrors?.original_price}
          errorMessage={formErrors?.original_price}
        />
      </Div>

      <Div className="flex items-center mt-3 gap-2">
      <Div className="flex gap-1 items-center">
          {productData.original_price > productData.selling_price && (
            <Typography className="line-through text-gray-400 text-[15px]">
              ₹{productData.original_price}
            </Typography>
          )}
          {productData.original_price > productData.selling_price && Math.trunc(getProductDiscountPercentage(productData.selling_price, productData.original_price)) !== 0 && (
            <Typography className="text-green-500 text-[15px]">
              {Math.trunc(getProductDiscountPercentage(productData.selling_price, productData.original_price))}% OFF
            </Typography>
          )}
        </Div>
        <Typography className="!text-[18px]">₹{productData.selling_price}</Typography>
      </Div>
    </Div>
  );
}
