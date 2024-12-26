"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Div, Typography } from "@/interface/fragments";
import { ThreeDotsIcon } from "@/interface/icons";
import { AlertText, CategoriesListAction, Label, TablePagination, NoData } from "@/interface/components";
import { getCategories } from "@/@api/dashboard/categories.api";
import { BACKEND_URL } from "../../../../../config";
import { makeUnauthorized } from "@/utils/cookie";
import OutsideClickHandler from "react-outside-click-handler";
import CategoryDemoImage from '../../../../../public/settings/category.png'
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import Cookies from "universal-cookie";

type CategoriesListProps = {
  isFetched: boolean
  setIsFetched: Dispatch<SetStateAction<boolean>>
}

export default function CategoriesList({ isFetched, setIsFetched } : CategoriesListProps) {

  const searchParams = useSearchParams()
  const { update_unauthorized } = useUserStore()

  const [loading, setLoading] = useState(true)
  const [openActionItemId, setOpenActionItemId] = useState<string | null>();
  const [mobileOpenActionItemId, setMobileOpenActionItemId] = useState<string | null>();
  const [categories, setCategories] = useState<any>([])
  const [errorMessage, setErrorMessage] = useState<string>("empty")

  // pagination
  const currentPage = searchParams.get("p") ?? '1'
  const indexOfFirstItem = (Number(currentPage) - 1) * 8
  const indexOfLastItem = indexOfFirstItem + 8
  const entries = categories.slice(indexOfFirstItem, indexOfLastItem)


  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
      setLoading(false)
    } catch (error: any) {
      if (error.response.status === 401) {
       const cookies = new Cookies();
       cookies.remove("token", { path: "/" });
       update_unauthorized()
    }
    setErrorMessage("Failed to fetch data, please retry")
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [isFetched]);


  // action
  const handleOpenAction = (itemId: string) => {
    setOpenActionItemId(openActionItemId === itemId ? null : itemId)
  };

  const handleOutsideClick = (itemId: string) => {
    if(itemId === openActionItemId) setOpenActionItemId(null)
  }

  const handleMobileOpenAction = (itemId: string) => {
    setMobileOpenActionItemId(openActionItemId === itemId ? null : itemId)
  };

  const handleMobileOutsideClick = (itemId: string) => {
    if(itemId === mobileOpenActionItemId) setMobileOpenActionItemId(null)
  }

  return (
    <Div className="mt-5 w-full rounded-theme shadow-sm">
      <Div className="w-full h-[2.3rem] border rounded-t-theme bg-[#f5f5f5] uppercase hidden md:flex items-center">
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">
            Category Image
          </Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Category Name</Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Active</Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Action</Typography>
        </Div>
      </Div>

      { errorMessage !== "empty" && 
        <Div className="flex justify-center" >
        <AlertText variant="danger" text={errorMessage} className="mt-[2rem] !h-[2rem]" >
        <Button className="!bg-red-500 !h-[2rem]" onClick={()=> setIsFetched(prev=> !prev)} >Refetch</Button>
        </AlertText>
        </Div>
      }

      { categories?.length === 0 && loading === false && (
        <NoData 
         title="Your Categories List is Empty"
         description="Let's start adding some categories! Begin by clicking on the 'Create Category' button."
        /> 
      )}
 
     {/* skelton */}
      {loading && (
        <Div className="w-full bg-white p-[9px] pt-[8px] flex flex-col gap-[15px] pb-[3rem]" >
          <Div className="flex items-center gap-5" >
            <Div className="w-[3.5rem] h-[3.5rem] rounded-full  placeholder-animation"></Div>
            <Div className="w-[78%] md:w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
          </Div>
          <Div className="flex items-center gap-5" >
            <Div className="w-[3.5rem] h-[3.5rem] rounded-full  placeholder-animation"></Div>
            <Div className="w-[78%] md:w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
          </Div>
          <Div className="flex items-center gap-5" >
            <Div className="w-[3.5rem] h-[3.5rem] rounded-full placeholder-animation"></Div>
            <Div className="w-[78%] md:w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
          </Div>
          <Div className="flex items-center gap-5" >
            <Div className="w-[3.5rem] h-[3.5rem] rounded-full  placeholder-animation"></Div>
            <Div className="w-[78%] md:w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
          </Div>
          <Div className="flex items-center gap-5" >
            <Div className="w-[3.5rem] h-[3.5rem] rounded-full  placeholder-animation"></Div>
            <Div className="w-[78%] md:w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
          </Div>
          <Div className="flex items-center gap-5" >
            <Div className="w-[3.5rem] h-[3.5rem] rounded-full placeholder-animation"></Div>
            <Div className="w-[78%] md:w-[95%] rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
          </Div>
        </Div>
      )}

      {/* pc */}
      <Div className="hidden md:flex flex-col">
        {entries?.map((data: any) => (
          <Div key={data?._id} className="w-full h-[4.7rem] border-b flex items-center bg-white">
          <Div className="w-[25%]">
            <Div className="flex justify-center items-center py-2" >
              { data.image === "no_image" ? 
               <Image
                className="w-[3.2rem] h-[3.2rem] rounded-md  object-cover object-center"
                src={CategoryDemoImage}
                alt="category image"
                width={0}
                height={0}
              /> : 
              <Image
                className="w-[3.5rem] rounded-md"
                src={`${BACKEND_URL}/public/images/categories/${data?.image}`}
                alt="category image"
                width={300}
                height={300}
              /> 
              }
            </Div>
          </Div>
          <Div className="w-[25%] text-center">
            <Typography className="text-[11px]">{data?.category_name}</Typography>
          </Div>
          <Div className="w-[25%] text-center">
           <Div className="flex justify-center" >
           <Label title={data?.status} className={`${data?.status === "Active" ? "bg-green-200 text-green-600" : "bg-yellow-200 text-yellow-600"}`} />
           </Div>
          </Div>
          <Div className="relative w-[25%] hidden md:flex justify-center items-center">
            <OutsideClickHandler onOutsideClick={()=> handleOutsideClick(data?._id)} >
             <Div onClick={() => handleOpenAction(data?._id)} className="flex items-center justify-center hover:bg-gray-100 w-[2rem] h-[1.5rem] rounded-[3px]">
               <ThreeDotsIcon />
             </Div>
             {openActionItemId === data?._id && (
                <CategoriesListAction 
                 setIsFetched={setIsFetched} 
                 data={data} 
                 handleOutsideClick={handleOutsideClick}
                 handleMobileOutsideClick={handleMobileOutsideClick}
              />)
              }
            </OutsideClickHandler>
          </Div>
        </Div>
        ))}
      </Div>

      {/* mobile */}
      <Div className="flex flex-col gap-4 md:hidden">
        {entries?.map((data: any) => (
          <Div key={data?._id} className="border border-transparent w-full min-h-[2.5rem] pb-3 rounded flex flex-col px-6 relative bg-white">
          <Div className="w-[90%]">
            <Div className="flex items-center gap-3 mt-2">
            { data.image === "no_image" ? 
               <Image
                className="w-[3.2rem] rounded-md"
                src={CategoryDemoImage}
                alt="category image"
                width={300}
                height={300}
              /> : 
              <Image
                className="w-[3.5rem] rounded-md"
                src={`${BACKEND_URL}/public/images/categories/${data?.image}`}
                alt="category image"
                width={300}
                height={300}
              /> 
              }
              <Typography className="text-[14px] font-medium">{data?.category_name}</Typography>
            </Div>
          </Div>

           <Div className="flex justify-end items-center gap-2 mt-1" >
           <Label title={data?.status} className={`${data?.status === "Active" ? "bg-green-200 text-green-600" : "bg-yellow-200 text-yellow-600"}`} />
           </Div>

           <OutsideClickHandler onOutsideClick={()=> handleMobileOutsideClick(data?._id)} >
             <Div onClick={() => handleMobileOpenAction(data?._id)}  className="flex items-center justify-center hover:bg-gray-100 w-[2rem] h-[1.5rem] rounded-[3px] absolute right-[5px] top-[6px]">
               <ThreeDotsIcon />
             </Div>
             {mobileOpenActionItemId === data?._id && (
              <CategoriesListAction 
               setIsFetched={setIsFetched} 
               data={data}
               className="!right-[2.1rem] !top-[1.8rem]"
               handleOutsideClick={handleOutsideClick}
               handleMobileOutsideClick={handleMobileOutsideClick}
             />
             )
             }
            </OutsideClickHandler>
        </Div>
        ))}
      </Div>
       <TablePagination 
        className="mt-2 md:mt-0"
        itemsPerPage={8}
        totalItems={categories.length}
        currentPage={Number(currentPage)}
       />

    </Div>
  );
}
