"use client"

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Div, InputField, Typography } from "@/interface/fragments";
import { EditProductTypes } from "@/types/dashboard/products";
import { calculateDiscountedPrice, getProductDiscountPercentage } from "@/utils";
import { useEditProductDefaultDataStore } from "@/zustand/dashboard/productStore";

type PriceDetailsProps = {
    editProductData: EditProductTypes
    setEditProductData: Dispatch<SetStateAction<EditProductTypes>>
    formErrors: any
    setFormErrors: Dispatch<any>
}

export default function PriceDetails({ setEditProductData, formErrors, setFormErrors, editProductData }: PriceDetailsProps) {

  const { selling_price, original_price } = useEditProductDefaultDataStore()
    

    const handlePriceChange = (e:  ChangeEvent<HTMLInputElement>) => {
      if (formErrors !== undefined) {
        const { [e.target.name]: _, ...rest } = formErrors;
        setFormErrors(rest);
      }

      setEditProductData((prevData) => ({
        ...prevData,
        [e.target.name]: Math.abs(Number(e.target.value)),
      }))
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
          defaultValue={selling_price}
          onChange={handlePriceChange}
          invalid={!!formErrors?.selling_price}
          errorMessage={formErrors?.selling_price}
        />
        <InputField
          label="Original Price (optional)"
          name="original_price"
          type="number"
          placeHolder="0.0"
          innerText="₹"
          innerTextStyle="left-3 mt-[3px]"
          containerStyle="w-full"
          className="!w-full bg-gray-100 mt-[2px] pl-[25px]"
          defaultValue={original_price === 0 ? undefined : original_price}
          onChange={handlePriceChange}
          invalid={!!formErrors?.original_price}
          errorMessage={formErrors?.original_price}
        />
      </Div>

      <Div className="flex items-center mt-3 gap-2">
        <Div className="flex gap-1 items-center">
          {editProductData.original_price > editProductData.selling_price && (
            <Typography className="line-through text-gray-400 text-[15px]">
              ₹{editProductData.original_price}
            </Typography>
          )}
          {editProductData.original_price > editProductData.selling_price && Math.trunc(getProductDiscountPercentage(editProductData.selling_price, editProductData.original_price)) !== 0 && (
            <Typography className="text-green-500 text-[15px]">
              {Math.trunc(getProductDiscountPercentage(editProductData.selling_price, editProductData.original_price))}% OFF
            </Typography>
          )}
        </Div>
        <Typography className="!text-[18px]">₹{editProductData.selling_price}</Typography>
      </Div>
    </Div>
  );
}
