"use client"

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Div, InputField, TextArea } from "@/interface/fragments";
import { CreateProductTypes } from "@/types/dashboard/products";
import { convertToSlug } from "@/utils";
import { Description } from "@/interface/components";

type TitleDescriptionProps = {
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
    setProductData: Dispatch<SetStateAction<CreateProductTypes>>
    productData: CreateProductTypes
    formErrors: any
}

export default function TitleDescription({ handleInputChange, setProductData, formErrors, productData }: TitleDescriptionProps) {

    const handleTitleChange = (e:  ChangeEvent<HTMLInputElement>) => {
        handleInputChange(e)
        setProductData((prevData) => ({
            ...prevData,
            slug: convertToSlug(e.target.value)
        }))
      }

  return (
    <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[1rem] pt-[3px]">
      <InputField
        type="text"
        name="title"
        label="Title"
        placeHolder="Product title"
        containerStyle="mt-3"
        inputContainerStyle="mt-[2px]"
        className="w-full bg-gray-100 mt-[2px]"
        onChange={handleTitleChange}
        invalid={!!formErrors?.title}
        errorMessage={formErrors?.title}
      />
      <TextArea
        label="Description (optional)"
        name="description"
        placeHolder="Product description..."
        value={productData.description}
        containerStyle="mt-3"
        inputContainerStyle="mt-[2px]"
        className="w-full bg-gray-100 mt-[2px]"
        onChange={handleInputChange}
      />
    </Div>
  );
}
