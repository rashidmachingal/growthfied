"use client"

import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, CheckBox, Div, InputField, Typography } from "@/interface/fragments";
import { createCategory, getActiveCategories } from "@/@api/dashboard/categories.api";
import { toast } from "sonner";
import { EditProductTypes } from "@/types/dashboard/products";
import { AddOutlineIcon, LoadingIcon } from "@/interface/icons";
import { revalidateServerAction } from "@/app/actions";
import NoDataImage from "../../../../../../public/settings/no-data.png"
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

type CategoriesDetailsProps = {
    setEditProductData: Dispatch<SetStateAction<EditProductTypes>>
    editProductData: EditProductTypes
}

export default function CategoriesDetails({ setEditProductData, editProductData }: CategoriesDetailsProps) {

    const { update_unauthorized } = useUserStore()  

    const [categories, setCategories] = useState<string[]>([])
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [isCategoriesFetched, setIsCategoriesFetched] = useState(false)
    const [categoryName, setCategoryName] = useState<string>("")
    const [categoryAddingLoading, setCategoryAddingLoading] = useState(false)

    const fetchCategories = async () => {
        try {
          const res = await getActiveCategories();
          setCategories(res.data);
          setCategoriesLoading(false)
        } catch (error: any) {
          if (error.response.status === 401) {
            const cookies = new Cookies();
            cookies.remove("token", { path: "/" });
            update_unauthorized()
          }
          toast.error("Failed to fetch categories")
          setCategoriesLoading(false)
        }
      }
    
      useEffect(() => {
        fetchCategories();
      }, [isCategoriesFetched]);
    
      const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value)
      }
    
      const handleAddCategory = async () => {
        if(categoryName === "") return
        setCategoryAddingLoading(true)
        // create category api call
        try {
          const res = await createCategory({image: "", category_name: categoryName})
          setEditProductData(prevData => ({
            ...prevData,
            categories: [...prevData.categories, res.data?.category_id]
          }));
          revalidateServerAction("category")
          toast.success("Category created successfully")
          setIsCategoriesFetched(prev=> !prev)
          setCategoryAddingLoading(false)
          setCategoryName("")
        } catch (error: any) {
          if (error.response.status === 401) {
            const cookies = new Cookies();
            cookies.remove("token", { path: "/" });
            update_unauthorized()
          }
          toast.error("Category creation failed")
          setCategoryAddingLoading(false)
          setCategoryName("")
        }
        
      }

      const handleCategoriesChange = (id: string) => {
        if(editProductData.categories.includes(id)){
          const categoryRemovedData = {
            ...editProductData,
            categories: editProductData.categories.filter(category => category !== id)
          }
          setEditProductData(categoryRemovedData)
        }else{
          setEditProductData(prevData => ({
            ...prevData,
            categories: [...prevData.categories, id]
          }));
        }
      }

  return (
    <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[10px] mt-[23px]">
      <Div className="flex items-center justify-between">
        <Typography className="text-[13px]">Categories (optional)</Typography>
      </Div>
      <Div className="flex w-[100%] justify-between items-center gap-[6px] mt-[8px]">
        <InputField
          type="text"
          name="category_name"
          placeHolder="Add new category"
          containerStyle="w-full"
          className="!w-full bg-gray-100 !h-[2rem] text-[13px]"
          value={categoryName}
          onChange={handleCategoryChange}
        />
        <Button
          disabled={categoryAddingLoading}
          onClick={handleAddCategory}
          className="!h-[2rem] !w-[5rem] gap-1 !bg-[#33333393]"
        >
          {categoryAddingLoading === false && <AddOutlineIcon />}
          {categoryAddingLoading === false && "Add"}
          {categoryAddingLoading === true && (
            <LoadingIcon className="animate-spin" />
          )}
        </Button>
      </Div>
      <Div className="mt-[9px] flex flex-col gap-2 h-[8rem] overflow-y-auto style-scroll">
        {categories?.length === 0 && categoriesLoading === false && (
          <Div className={`w-full h-[25rem] bg-white rounded-[6px] flex flex-col items-center justify-center`} >
          <Image src={NoDataImage} width={80} height={80} alt="no data image" />
          <Typography className="font-medium text-center mt-[5px]" variant="h6" >Your Categories List is Empty</Typography>
          <Typography className="text-[13px] text-center" >Let&apos;s start adding some categories!</Typography>
         </Div>
        )}
        {categoriesLoading === true && (
          <>
            <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation mt-[6px]"></Div>
            <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
            <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
            <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
          </>
        )}
        {categories?.map((data: any) => {
          let checked = editProductData.categories.some((id: string) => {
            return data._id === id;
          });
          return (
            <Div
              onClick={() => handleCategoriesChange(data._id)}
              key={data?._id}
              className="flex items-center gap-[6px] hover:bg-gray-100 p-[5px] px-[8px] rounded-[2px]"
            >
              <CheckBox checked={checked} onChange={() => {}} />
              <Typography className="text-[13px] cursor-pointer">
                {data?.category_name}
              </Typography>
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}
