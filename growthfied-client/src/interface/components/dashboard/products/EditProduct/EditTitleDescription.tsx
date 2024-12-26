"use client"

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Div, InputField, TextArea } from "@/interface/fragments";
import { EditProductTypes } from "@/types/dashboard/products";
import { convertToSlug } from "@/utils";

type TitleDescriptionProps = {
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
    editProductData: EditProductTypes
    setEditProductData: Dispatch<SetStateAction<EditProductTypes>>
    formErrors: any
}

export default function TitleDescription({ handleInputChange, setEditProductData, formErrors, editProductData }: TitleDescriptionProps) {

    const handleTitleChange = (e:  ChangeEvent<HTMLInputElement>) => {
        handleInputChange(e)
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
        defaultValue={editProductData.title}
        onChange={handleTitleChange}
        invalid={!!formErrors?.title}
        errorMessage={formErrors?.title}
      />
      <TextArea
        label="Description (optional)"
        name="description"
        placeHolder="Product description..."
        containerStyle="mt-3"
        inputContainerStyle="mt-[2px]"
        className="w-full bg-gray-100 mt-[2px]"
        defaultValue={editProductData.description}
        onChange={handleInputChange}
      />
    </Div>
  );
}
