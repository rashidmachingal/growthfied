"use client"

import Image from "next/image";
import { Div, InputField, Label, PlainButton, Typography } from "@/interface/fragments";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { EditProductTypes } from "@/types/dashboard/products";
import { CloseButtonIcon, ExclamationIcon, LoadingIcon } from "@/interface/icons";
import imageCompression from 'browser-image-compression';
import { toast } from "sonner";
import AddImage from "../../../../../../public/settings/add-image.svg"

type EditImagesDetaislProps = {
    setEditProductData: Dispatch<SetStateAction<EditProductTypes>>
    editProductData: EditProductTypes
}


export default function EditImagesDetails({ setEditProductData, editProductData }: EditImagesDetaislProps) {

  const [loadingStates, setLoadingStates] = useState({
    image_one: false,
    image_two: false,
    image_three: false,
  });

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoadingStates((prevData) => ({
      ...prevData,
      [e.target.name]: true
    }))
    const image_file = e.target.files ? e.target.files[0] : null;
    if(image_file){

      if (image_file.size > 11 * 1024 * 1024) {
        setLoadingStates((prevData) => ({
          ...prevData,
          [e.target.name]: false
        }))
        return toast.error("Image Size: Keep it under 10MB",
          { icon: <ExclamationIcon className="!fill-yellow-500" /> })
      }

      // Options for compression
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: undefined,
        useWebWorker: true,
        initialQuality: 1.0,
        alwaysKeepResolution: true,
      };

      try {
        let compressedBlob = await imageCompression(image_file, options);
        const compressedFile = new File([compressedBlob], image_file.name, {
          type: compressedBlob.type,
        });
        setEditProductData((prevData) => ({
          ...prevData,
          images: {
            ...prevData.images,
            [e.target.name]: compressedFile
          },
          temporary_image_urls: {
            ...prevData.temporary_image_urls,
            [e.target.name]: (URL.createObjectURL(image_file))
          }
        }))
        setLoadingStates((prevData) => ({
          ...prevData,
          [e.target.name]: false
        }))
      } catch (error) {
        setEditProductData((prevData) => ({
          ...prevData,
          images: {
            ...prevData.images,
            [e.target.name]: image_file
          },
          temporary_image_urls: {
            ...prevData.temporary_image_urls,
            [e.target.name]: (URL.createObjectURL(image_file))
          }
        }))
        setLoadingStates((prevData) => ({
          ...prevData,
          [e.target.name]: false
        }))
      }
    }
}
    
      const handleRemoveImage = (image_name: string) => {
        setEditProductData((prevData) => ({
          ...prevData,
          images: {
            ...prevData.images,
            [image_name] : "no_image"
          },
          temporary_image_urls: {
            ...prevData.temporary_image_urls,
            [image_name]: null
          }
        }))
      }

  return (
    <Div className="mt-[20px] w-full bg-white rounded-[4px] px-[12px] pt-[8px] pb-[12px]">
      <Typography className="text-[13px]">Product Images (optional)</Typography>
      <Div className="flex flex-wrap lg:flex-nowrap gap-3 lg:gap-5">
        <Div className="flex flex-col gap-1 w-full lg:w-[60%] md:mt-3">
          <Typography className="text-[14px]">Image 1 (Thumbnail)</Typography>
          <InputField
            onChange={handleImageChange}
            name="image_one"
            id="image_one"
            type="file"
            accept="image/*"
            className="hidden"
          />
          {editProductData.temporary_image_urls.image_one === null ? (
            <>
            <Label
              htmlFor="image_one"
              className="bg-gray-100 h-[20rem] md:h-[15rem] w-[100%] flex flex-col items-center justify-center gap-2 rounded-theme  border-gray-400 hover:border-black border-2 cursor-copy"
              >
              { loadingStates.image_one ? (
                <LoadingIcon className="animate-spin" />
              ) : (
                <>
                 <Image
                  className="w-[2.5rem]"
                  width={0}
                  height={100}
                  src={AddImage}
                  alt="add image"
                 />
                 <Typography className="mt-[2px] text-[10px] text-gray-700 text-center">
                  Click to add image
                 </Typography>
                </>
              )}
            </Label>
            </>
          ) : (
            <Div className="relative" >
              <Image
                width={350}
                height={350}
                src={editProductData.temporary_image_urls.image_one || ""}
                alt="image_one"
                className="w-full h-[20rem] md:h-[15rem] object-center object-cover rounded-[5px] border"
              />
               <PlainButton  onClick={() => handleRemoveImage("image_one")} className="rounded-full flex items-center justify-center text-[14px] absolute top-[-10px] right-[-10px] z-10 bg-red-600 hover:bg-red-700 w-[1.5rem] h-[1.5rem] cursor-pointer">
               <CloseButtonIcon className="!stroke-white" />
               </PlainButton>
            </Div>
          )}
        </Div>
        <Div className="flex items-center w-full gap-5" >
        <Div className="flex flex-col gap-1 w-full lg:w-[50%] md:mt-3">
          <Typography className="text-[14px]">Image 2 (optional)</Typography>
          <InputField
            onChange={handleImageChange}
            name="image_two"
            id="image_two"
            type="file"
            accept="image/*"
            className="hidden"
          />
          {editProductData.temporary_image_urls.image_two === null ? (
            <>
            <Label
              htmlFor="image_two"
              className="bg-gray-100 h-[13rem] md:h-[15rem] w-[100%] flex flex-col items-center justify-center gap-2 rounded-theme  border-gray-400 hover:border-black border-2 cursor-copy"
              >
              { loadingStates.image_two ? (
                <LoadingIcon className="animate-spin" />
              ) : (
                <>
                 <Image
                  className="w-[2.5rem]"
                  width={0}
                  height={100}
                  src={AddImage}
                  alt="add image"
                 />
                 <Typography className="mt-[2px] text-[10px] text-gray-700 text-center">
                  Click to add image
                 </Typography>
                </>
              )}
            </Label>
            </>
          ) : (
            <Div className="relative" >
              <Image
                width={350}
                height={350}
                src={editProductData.temporary_image_urls.image_two || ""}
                alt="image_two"
                className="w-full h-[13rem] md:h-[15rem] object-center object-cover rounded-[5px] border"
              />
              <PlainButton  onClick={() => handleRemoveImage("image_two")} className="rounded-full flex items-center justify-center text-[14px] absolute top-[-10px] right-[-10px] z-10 bg-red-600 hover:bg-red-700 w-[1.5rem] h-[1.5rem] cursor-pointer">
               <CloseButtonIcon className="!stroke-white" />
             </PlainButton>
            </Div>
          )}
        </Div>
        <Div className="flex flex-col gap-1 w-full lg:w-[50%] md:mt-3">
          <Typography className="text-[14px]">Image 3 (optional)</Typography>
          <InputField
            onChange={handleImageChange}
            name="image_three"
            id="image_three"
            type="file"
            accept="image/*"
            className="hidden"
          />
          {editProductData.temporary_image_urls.image_three === null ? (
            <>
            <Label
              htmlFor="image_three"
              className="bg-gray-100 h-[13rem] md:h-[15rem] w-[100%] flex flex-col items-center justify-center gap-2 rounded-theme  border-gray-400 hover:border-black border-2 cursor-copy"
            >
              { loadingStates.image_three ? (
                <LoadingIcon className="animate-spin" />
              ) : (
                <>
                 <Image
                  className="w-[2.5rem]"
                  width={0}
                  height={100}
                  src={AddImage}
                  alt="add image"
                 />
                 <Typography className="mt-[2px] text-[10px] text-gray-700 text-center">
                  Click to add image
                 </Typography>
                </>
              )}
            </Label>
            </>
          ) : (
            <Div className="relative" >
              <Image
                width={350}
                height={350}
                src={editProductData.temporary_image_urls.image_three || ""}
                alt="image_three"
                className="w-full h-[13rem] md:h-[15rem] object-center object-cover rounded-[5px] border"
              />
              <PlainButton  onClick={() => handleRemoveImage("image_three")} className="rounded-full flex items-center justify-center text-[14px] absolute top-[-10px] right-[-10px] z-10 bg-red-600 hover:bg-red-700 w-[1.5rem] h-[1.5rem] cursor-pointer">
               <CloseButtonIcon className="!stroke-white" />
              </PlainButton>
            </Div>
          )}
        </Div>
        </Div>
      </Div>
    </Div>
  );
}
