"use client"

import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Button, Div, InputField, Label, Typography } from "@/interface/fragments";
import { AlertText, Popup } from "@/interface/components";
import { CameraIcon, LoadingIcon } from "@/interface/icons";
import { CategoryDataTypes } from "@/types/dashboard/categories";
import { formValidation } from "@/utils/formValidation";
import { createCategory } from "@/@api/dashboard/categories.api";
import { toast } from "sonner";
import { revalidateServerAction } from "@/app/actions";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

type CreateCategoryProps = {
  open: boolean
  onClose:  () => void
  setIsFetched: Dispatch<SetStateAction<boolean>>
}

export default function CreateCategory({ open, onClose, setIsFetched }: CreateCategoryProps) {

  const { update_unauthorized } = useUserStore()

  const InitialCategoryData = {
    image: "",
    temporary_image_url: null,
    category_name: "",
  }

  const [categoryData, setCategoryData] = useState<CategoryDataTypes>(InitialCategoryData)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [formErrors, setFormErrors] = useState<any>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    if(e.target.name === "image"){
      const image = e.target.files ? e.target.files[0] : null;
      if(image){
        setCategoryData((prevData) => ({
          ...prevData,
          image: image,
          temporary_image_url: (URL.createObjectURL(image))
        }));
      }
    }else{
      setCategoryData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  }

  const handleCreateCategory = async () => {
    // form validation
    const newFormErrors = formValidation(categoryData, ["image", "temporary_image_url"])
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return

    setLoading(true)

    // create category api call
    try {
      await createCategory(categoryData)
      revalidateServerAction("category")
      toast.success("Category created successfully")
      setCategoryData(InitialCategoryData)
      setLoading(false)
      setIsFetched(prev=> !prev)
      onClose()
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
      }
      setLoading(false)
      setErrorMessage("something went wrong")
      toast.error("Category creation failed")
    }
  }

  const handleRemoveImage = () => {
    setCategoryData((prevData) => ({
      ...prevData,
      "temporary_image_url": null,
      "image" : ""
    }));
  }

  const handleClose = () => {
    onClose()
    setErrorMessage("empty")
    setFormErrors({})
  }



  return (
    <Popup open={open} onClose={onClose}>
      <Div className="w-[95vw] lg:w-[40vw] shadow  bg-white rounded-theme p-5 pt-4">
        <Div className="flex items-center justify-between border-b pb-2">
          <Typography className="font-medium">Create Category</Typography>
        </Div>
        <Div className="flex flex-col pl-1 pb-2 gap-[8px] w-full overflow-auto style-scroll pr-3">
            <Div className="flex flex-col items-center" >
             { categoryData.temporary_image_url !== null && 
             <Image 
               width={150}
               height={150}
               src={categoryData.temporary_image_url} 
               className="w-[10rem] h-[10rem] rounded-[5px] object-center object-cover border border-gray-300 mt-2" 
               alt="img"
             />}
            { categoryData.temporary_image_url !== null && <Div onClick={handleRemoveImage} className="text-[12px] hover:underline cursor-pointer text-yellow-600 mt-1" >Remove</Div>}
            <Label htmlFor="image" className="w-[70%] md:w-[15rem] mt-[15px] font-medium flex items-center justify-center gap-2 text-[13px] border border-black hover:border-black h-theme px-[1.5rem] rounded-[50px]" >
              <CameraIcon className="stroke-[#333]" />
              {categoryData.temporary_image_url === null ? "Upload Category Image" : "Change Image" }
            </Label>
            </Div>
            <InputField name="image" onChange={handleChange} accept="image/*" id="image" type="file" className="hidden" />
            <InputField 
             name="category_name" 
             type="text"  
             label="Category Name" 
             placeHolder="Category Name" 
             className="text-[12px] w-full bg-gray-200 mt-[3px] border-[#3333332f] border"
             onChange={handleChange} 
             invalid={!!formErrors?.category_name}
             errorMessage={formErrors?.category_name}
            />
        </Div>
        <Div className="mt-[30px] flex justify-end gap-3">
          <Button onClick={handleClose} className="!h-[2rem] w-[5rem] border-black !bg-gray-200 hover:!bg-gray-300 !text-black">
            Close
          </Button>
          <Button onClick={handleCreateCategory} disabled={loading} className="!h-[2rem] !w-[6rem]">
           {loading ? <LoadingIcon className="animate-spin" /> : "Create"}
          </Button>
        </Div>

        { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
      </Div>
    </Popup>
  );
}
