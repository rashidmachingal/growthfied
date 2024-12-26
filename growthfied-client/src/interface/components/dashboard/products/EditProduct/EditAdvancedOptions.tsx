"use client"

import ReactSwitch from "react-switch";
import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Div, InputField, SelectDropdown, Typography } from "@/interface/fragments";
import { EditProductTypes } from "@/types/dashboard/products";
import AddtionalMessageImage from "../../../../../../public/settings/additional-message.png"
import AcceptImagesImage from "../../../../../../public/settings/accept_images.png"

type AdvancedOptionsProps = {
    setEditProductData: Dispatch<SetStateAction<EditProductTypes>>
    editProductData: EditProductTypes
}

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

  const acceptImagesOptions = [{
      label: "1",
      value: 1,
    },
    {
      label: "2",
      value: 2,
    },
    {
      label: "3",
      value: 3,
    },
    {
      label: "4",
      value: 4,
    }
  ];

export default function AdvancedOptions({ editProductData, setEditProductData }: AdvancedOptionsProps) {

    useEffect(() => {
      setAcceptImages({
        label: String(editProductData.accept_images.number),
        value: editProductData.accept_images.number
      })

      if(editProductData.accept_message.required){
        setIsAcceptMessageRequired(additionalMessageOptions[1])
      }else{
        setIsAcceptMessageRequired(additionalMessageOptions[0])
      }
    }, [editProductData])
    


    const [acceptImages, setAcceptImages] = useState(acceptImagesOptions[0])
    const [isAcceptMessageRequired, setIsAcceptMessageRequired] = useState(additionalMessageOptions[0])

    const handleAcceptImageStatusChange = () => {
        setEditProductData((prevData) => ({
          ...prevData,
          accept_images: {
            ...prevData.accept_images,
            allow: !prevData.accept_images.allow
          }
        }))
      }
    
      const handleAcceptImageNumberChange = (value: any) => {
        setEditProductData((prevData) => ({
          ...prevData,
          accept_images: {
            ...prevData.accept_images,
            number: value.value
          }
        }))
      }
    
      const handleAcceptMessageChange = () => {
        setEditProductData((prevData)=> ({
          ...prevData,
          accept_message: {
            ...prevData.accept_message,
            allow: !prevData.accept_message.allow
          }
        }))
      }

      const handleAcceptMessageRequireChange = (value: any) => {
        setEditProductData((prevData)=> ({
          ...prevData,
          accept_message: {
            ...prevData.accept_message,
            required: value.value
          }
        }))
      }

      const handleAcceptMessageLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditProductData((prevData)=> ({
          ...prevData,
          accept_message: {
            ...prevData.accept_message,
            label: e.target.value
          }
        }))
      }

  return (
    <>
      <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[10px] mt-[23px]">
        <Div className="flex justify-between">
          <Typography className="text-[13px]">
            Accept Images From Customer (optional)
          </Typography>
          <ReactSwitch
            width={38}
            height={20}
            boxShadow="0px 1px 5px #00000099"
            onColor="#333"
            checkedIcon={false}
            uncheckedIcon={false}
            checked={editProductData.accept_images.allow}
            onChange={handleAcceptImageStatusChange}
          />
        </Div>
        <Div>
          <Typography className="text-[10px] md:mt-1">
            If you sell products like photo frames, enable this feature, there
            will be an option for users to upload images.
          </Typography>
          <Typography className="text-[12px] text-yellow-500 mt-2 font-medium">
            Important: Users can only upload maximum four images!
          </Typography>
        </Div>
        {editProductData.accept_images.allow && (
          <Div className="mt-3">
            <Typography className="text-[13px]">
              Number of images you need to accept
            </Typography>
            <SelectDropdown
              className="mt-[3px]"
              options={acceptImagesOptions}
              defaultValue={acceptImages}
              setDefaultValue={setAcceptImages}
              onChange={handleAcceptImageNumberChange}
            />
          </Div>
        )}
        <Div className="flex  items-center p-2 pb-0 mt-1" >
          <Image className="shadow-md w-full md:w-[25rem]" src={AcceptImagesImage} width={0} height={0} alt="additional message" />
        </Div>
      </Div>

      <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[10px] mt-[23px]">
        <Div className="flex justify-between">
          <Typography className="text-[13px]">
            Accept Additional Message From Customer (optional)
          </Typography>
          <ReactSwitch
            width={38}
            height={20}
            boxShadow="0px 1px 5px #00000099"
            onColor="#333"
            checkedIcon={false}
            uncheckedIcon={false}
            checked={editProductData.accept_message.allow}
            onChange={handleAcceptMessageChange}
          />
        </Div>
        <Div>
          <Typography className="text-[10px] md:mt-1">
            This feature enables an optional (not required) message box where
            users can write custom messages for you.
          </Typography>
        </Div>
        {editProductData.accept_message.allow && (
          <>
           <Div className="flex items-center gap-2" >
           <InputField
            type="text"
            name="title"
            label="Label"
            placeHolder="Eg: Any additional message?"
            defaultValue={editProductData.accept_message.label}
            onChange={handleAcceptMessageLabelChange}
            containerStyle="mt-3 w-full"
            inputContainerStyle="mt-[2px]"
            className="w-full bg-gray-100 mt-[2px] placeholder:text-[12px]"
           />
           <SelectDropdown
            options={additionalMessageOptions}
            defaultValue={isAcceptMessageRequired}
            setDefaultValue={setIsAcceptMessageRequired}
            onChange={handleAcceptMessageRequireChange}
            className="mt-[30px] md:mt-[34px]"
           />
          </Div>
         </>
        )}
        <Div className="flex  items-center p-2 pb-0 mt-1" >
          <Image className="shadow-md w-full md:w-[25rem]" src={AddtionalMessageImage} width={0} height={0} alt="additional message" />
        </Div>
      </Div>
    </>
  );
}
