"use client"

import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Div, InputField, Label, Typography } from "@/interface/fragments";
import { AlertText, Popup } from "@/interface/components";
import { CameraIcon, LoadingIcon } from "@/interface/icons";
import { UpdateCategoryDataTypes } from "@/types/dashboard/categories";
import { formValidation } from "@/utils/formValidation";
import { updateCategory } from "@/@api/dashboard/categories.api";
import { toast } from "sonner";
import { BACKEND_URL } from "../../../../../config";
import CategoryDemoImage from '../../../../../public/settings/category.png'
import { revalidateServerAction } from "@/app/actions";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

type UpdateCategoryProps = {
  open: boolean
  onClose:  () => void
  setIsFetched: Dispatch<SetStateAction<boolean>>
  defaultData: any
  handleOutsideClick: (id: string) => void
  handleMobileOutsideClick: (id: string) => void
}

export default function UpdateCategory({ open, onClose, setIsFetched, defaultData, handleMobileOutsideClick, handleOutsideClick }: UpdateCategoryProps) {

  const { update_unauthorized } = useUserStore()

  const InitialUpdateCategoryData = {
    image: "",
    temporary_image_url: `${BACKEND_URL}/public/images/categories/${defaultData.image}`,
    category_name: defaultData.category_name,
    prev_category_image: defaultData.image,
    is_image: defaultData.image
  }

  const [updateCategoryData, setUpdateCategoryData] = useState<UpdateCategoryDataTypes>(InitialUpdateCategoryData)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [formErrors, setFormErrors] = useState<any>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    if(e.target.name === "image"){
      const image = e.target.files ? e.target.files[0] : null;
      if(image){
        setUpdateCategoryData((prevData) => ({
          ...prevData,
          image: image,
          temporary_image_url: (URL.createObjectURL(image)),
          is_image: (URL.createObjectURL(image))
        }));
      }
    }else{
      setUpdateCategoryData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  }

  const handleUpdateCategory = async () => {
    // form validation
    const newFormErrors = formValidation(updateCategoryData, ["image", "temporary_image_url"])
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return
    setLoading(true)

    // update category api call
    try {
      await updateCategory(defaultData._id, updateCategoryData)
      revalidateServerAction("category")
      toast.success("Category update successfully")
      setUpdateCategoryData(InitialUpdateCategoryData)
      setLoading(false)
      setIsFetched(prev=> !prev)
      handleClose()
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
      }
      setLoading(false)
      setErrorMessage("something went wrong")
      toast.error("Category update failed!")
      handleClose()
    }
  }

  const handleRemoveImage = () => {
    setUpdateCategoryData((prevData) => ({
      ...prevData,
      "temporary_image_url": null,
      "image" : "no_image",
      "is_image" : "no_image"
    }));
  }

  const handleClose = () => {
    onClose()
    setErrorMessage("empty")
    setFormErrors({})
    handleOutsideClick(defaultData._id)
    handleMobileOutsideClick(defaultData._id)
  }

  return (
    <Popup open={open} onClose={handleClose}>
      <Div className="w-[95vw] lg:w-[40vw] shadow  bg-white rounded-theme p-5 pt-4 overflow-y-auto">
        <Div className="flex items-center justify-between border-b pb-2">
          <Typography className="font-medium">Update Category</Typography>
        </Div>
        <Div className="flex flex-col pl-1 pb-2 gap-[8px] w-full overflow-auto style-scroll pr-3">
            <Div className="flex flex-col items-center" >
              { updateCategoryData.is_image !== "no_image" && <Image 
               width={150}
               height={150}
               src={updateCategoryData.temporary_image_url || CategoryDemoImage} 
               className="w-[10rem] h-[10rem] rounded-[5px] object-center object-cover border border-gray-300 mt-2" 
               alt="img"
             />}

              { updateCategoryData.is_image === "no_image" && <Image 
               width={150}
               height={150}
               src={CategoryDemoImage} 
               className="w-[10rem] h-[10rem] rounded-[5px] object-center object-cover border border-gray-300 mt-2" 
               alt="img"
             />}
            
            { updateCategoryData.temporary_image_url !== null && updateCategoryData.is_image !== "no_image" && <Div onClick={handleRemoveImage} className="text-[12px] hover:underline cursor-pointer text-yellow-600 mt-1" >Remove</Div>}
            <Label htmlFor="image" className="w-[70%] md:w-[15rem] mt-[15px] font-medium flex items-center justify-center gap-2 text-[13px] border border-black hover:border-black h-theme px-[1.5rem] rounded-[50px]" >
              <CameraIcon className="stroke-[#333]" />
              {updateCategoryData.temporary_image_url === null ? "Upload Category Image" : "Change Image" }
            </Label>
            </Div>
            <InputField name="image" onChange={handleChange} accept="image/*" id="image" type="file" className="hidden" />
            <InputField 
             name="category_name" 
             type="text"  
             label="Category Name" 
             placeHolder="Category Name" 
             className="text-[12px] w-full bg-gray-200 mt-[3px] border-[#3333332f] border"
             defaultValue={defaultData.category_name}
             onChange={handleChange} 
             invalid={!!formErrors?.category_name}
             errorMessage={formErrors?.category_name}
            />
        </Div>
        <Div className="mt-[30px] flex justify-end gap-3">
          <Button onClick={handleClose} className="!h-[2rem] w-[5rem] border-black !bg-gray-200 hover:!bg-gray-300 !text-black">
            Close
          </Button>
          <Button onClick={handleUpdateCategory} disabled={loading} className="!h-[2rem] !w-[6rem]">
           {loading ? <LoadingIcon className="animate-spin" /> : "Update"}
          </Button>
        </Div>

        { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
      </Div>
    </Popup>
  );
}
