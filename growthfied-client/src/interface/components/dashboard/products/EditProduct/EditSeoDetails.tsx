"use client"

import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Div, InputField, Typography } from "@/interface/fragments";
import { EditProductTypes } from "@/types/dashboard/products";
import ReactSwitch from "react-switch";
import AddtionalMessageImage from "../../../../../../public/settings/additional-message.png"

type EditSeoDetailsProps = {
    editProductData: EditProductTypes
    setEditProductData: Dispatch<SetStateAction<EditProductTypes>>
}

export default function EditSeoDetails({ editProductData, setEditProductData }: EditSeoDetailsProps) {

    const additionalMessageOptions = [
        {
         label: "Optional",
         value: false,
        },
        {
         label: "Required",
         value: true,
        }
      ]

    const [isAcceptMessageRequired, setIsAcceptMessageRequired] = useState(additionalMessageOptions[0])

    const handleEnableSeo = () => {
        setEditProductData((prevData) => ({
            ...prevData,
            seo: {
                ...prevData.seo,
                allow: !prevData.seo.allow,
            }
        }))
    }

    const handleMetaData = (e: ChangeEvent<HTMLInputElement>) => {
      setEditProductData((prevData) => ({
        ...prevData,
        seo: {
          ...prevData.seo,
          [e.target.name]: e.target.value
        }
      }))
    }

  return (
    <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[10px] mt-[23px]">
      <Div className="flex justify-between">
        <Typography className="text-[13px]">
          Custom Meta Title & Meta Description (optional)
        </Typography>
        <ReactSwitch
          width={38}
          height={20}
          boxShadow="0px 1px 5px #00000099"
          onColor="#333"
          checkedIcon={false}
          uncheckedIcon={false}
          checked={editProductData.seo.allow}
          onChange={handleEnableSeo}
        />
      </Div>
      <Div>
        <Typography className="text-[10px] md:mt-1">
        Add custom meta title & description, or default to product title and description automatically.
        </Typography>
      </Div>
      {editProductData.seo.allow && (
        <>
            <InputField
              type="text"
              name="meta_title"
              label="Meta Title"
              placeHolder="Meta Title"
              defaultValue={editProductData.seo.meta_title}
              onChange={handleMetaData}
              containerStyle="mt-3 w-full"
              inputContainerStyle="mt-[2px]"
              className="w-full bg-gray-100 mt-[2px] placeholder:text-[12px]"
            />
            <InputField
              type="text"
              name="meta_description"
              label="Meta Description"
              placeHolder="Meta Description"
              defaultValue={editProductData.seo.meta_description}
              onChange={handleMetaData}
              containerStyle="mt-3 w-full"
              inputContainerStyle="mt-[2px]"
              className="w-full bg-gray-100 mt-[2px] placeholder:text-[12px]"
            />
        </>
      )}
      {/* <Div className="flex  items-center p-2 pb-0 mt-1">
        <Image
          className="shadow-md w-full md:w-[25rem]"
          src={AddtionalMessageImage}
          width={0}
          height={0}
          alt="additional message"
        />
      </Div> */}
    </Div>
  );
}
