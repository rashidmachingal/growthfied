"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Div, Typography } from "@/interface/fragments";
import { EditOutlineIcon, ThreeDotsIcon } from "@/interface/icons";
import { AlertText, Label, NoData, ProductListAction, TablePagination } from "@/interface/components";
import { getProducts } from "@/@api/dashboard/products.api";
import { getProductThumbnail, getTotalQuanityFromVariantsOptions } from "@/utils";
import { useEditProductDefaultDataStore } from "@/zustand/dashboard/productStore";
import { CreateProductTypes } from "@/types/dashboard/products";
import OutsideClickHandler from "react-outside-click-handler";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

type ProductsListProps = {
  isFetched: boolean
  setIsFetched: Dispatch<SetStateAction<boolean>>
}

export default function ProductsList({ isFetched, setIsFetched }: ProductsListProps) {

  const { update_edit_product_default_data, update_fetch_status } = useEditProductDefaultDataStore()
  const { update_unauthorized } = useUserStore()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [openActionItemId, setOpenActionItemId] = useState<string | null>();
  const [mobileOpenActionItemId, setMobileOpenActionItemId] = useState<string | null>();
  const [products, setProducts] = useState<any>([])
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  
  // pagination
  const currentPage = searchParams.get("p") ?? '1'
  const indexOfFirstItem = (Number(currentPage) - 1) * 8
  const indexOfLastItem = indexOfFirstItem + 8
  const entries = products.slice(indexOfFirstItem, indexOfLastItem)

  // fetch
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
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
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleEditClick = (data: CreateProductTypes) => {
    if(update_edit_product_default_data) update_edit_product_default_data(data)
    if(update_fetch_status) update_fetch_status(false)
  }

  return (
    <Div className="mt-5 w-full rounded-theme shadow-sm">
      <Div className="w-full h-[2.3rem] border rounded-t-theme bg-[#f5f5f5] uppercase hidden md:flex items-center px-6 ">
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">
            Product
          </Typography>
        </Div>
        <Div className="w-[15%] text-center">
          <Typography className="text-[11px] font-semibold">Stocks</Typography>
        </Div>
        <Div className="w-[15%] text-center">
          <Typography className="text-[11px] font-semibold">Status</Typography>
        </Div>
        <Div className="w-[15%] text-center">
          <Typography className="text-[11px] font-semibold">Selling Price</Typography>
        </Div>
        <Div className="w-[15%] text-center">
          <Typography className="text-[11px] font-semibold">Edit</Typography>
        </Div>
        <Div className="w-[15%] text-center">
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

      { products?.length === 0 && loading === false && (
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
        {entries?.map((data: any)=> (
         <Div key={data?._id} className="w-full min-h-[2.5rem] border-b flex items-center px-6 bg-white">
           <Div className="w-[25%] py-2">
           <Div className="flex items-center gap-[3rem]" >
             <Image
               width={150}
               height={150}
               className="!w-[5rem] !h-[5rem] object-cover object-center rounded-[5px]"
               src={getProductThumbnail(data)}
               alt="product image"
             />
             <Typography className="text-[11px]">
               {data?.title}
             </Typography>
           </Div>
         </Div>
         <Div className="w-[15%] text-center">
           {data?.variants.variant_name === "" ? (
             <Typography className="text-[11px] capitalize">{data?.quantity}</Typography>
           ): (
            <Typography className="text-[11px] capitalize">
              {getTotalQuanityFromVariantsOptions(data?.variants.options_quantity, data?.variants.options)}
            </Typography>
           )}
         </Div>
         <Div className="w-[15%] flex items-center justify-center">
           <Label title={data?.status} className={`${data.status === "Active" ? 'bg-green-200 text-green-600' : 'bg-yellow-200 text-yellow-600'}`} />
         </Div>
         <Div className="w-[15%] text-center">
           <Typography className="text-[13px]">
            ₹{data?.selling_price}
           </Typography>
         </Div>
         <Div className="w-[15%] flex items-center justify-center">
           <Link onClick={()=> handleEditClick(data)} href={`/dashboard/products/edit/${data?._id}?p=${currentPage}`} className="flex items-center justify-center hover:bg-gray-100 w-[2rem] h-[1.5rem] rounded-[3px]">
             <EditOutlineIcon />
           </Link>
         </Div>
         <Div className="relative w-[15%] hidden md:flex justify-center items-center">
           
           <OutsideClickHandler onOutsideClick={()=> handleOutsideClick(data?._id)} >
           <Div onClick={() => handleOpenAction(data?._id)} className="flex items-center justify-center hover:bg-gray-100 w-[2rem] h-[1.5rem] rounded-[3px]">
               <ThreeDotsIcon />
           </Div>
            {openActionItemId === data?._id && (
              <ProductListAction 
                data={data}
                handleMobileOutsideClick={handleMobileOpenAction}
                handleOutsideClick={handleOpenAction}
                setIsFetched={setIsFetched}
              />
            )}
           </OutsideClickHandler>
         </Div>
          </Div>
        ))}
      </Div>

      {/* mobile */}
      <Div className="flex flex-col gap-4 md:hidden">
        {entries.map((data: any) => (
          <Div key={data?._id} className="border-transparent w-full min-h-[2.5rem] pb-3 rounded flex flex-col px-6 relative bg-white">
          <Div className="w-[90%] hover:underline">
            <Div className="flex items-center gap-3">
             <Image
               width={150}
               height={150}
               className="!w-[5rem] !h-[5rem] object-cover object-center mt-[10px] rounded-[5px]"
               src={getProductThumbnail(data)}
               alt="product image"
             />
              <Typography className="text-[12px] font-medium cursor-pointer">
                {data?.title}
              </Typography>
            </Div>
          </Div>

          <Div className="flex justify-between flex-wrap gap-2 mt-[0.8rem]" >
           <Div className="flex gap-2 mt-1" >
            <Typography className="text-xs" >Selling Price :</Typography>
            <Div className="flex flex-col justify-between" >
            <Typography className="text-[12px]">
              ₹{data?.selling_price}
            </Typography>
            </Div>
           </Div>
           <Div className="flex gap-2 mt-1" >
            <Typography className="text-xs" >Stocks :</Typography>
            {data?.variants.variant_name === "" ? (
             <Typography className="text-[11px] capitalize">{data?.quantity}</Typography>
           ): (
            <Typography className="text-[11px] capitalize">
              {getTotalQuanityFromVariantsOptions(data?.variants.options_quantity, data?.variants.options)}
            </Typography>
           )}
           </Div>
           <Div>
           <Label title={data?.status} className={`${data.status === "Active" ? 'bg-green-200 text-green-600' : 'bg-yellow-200 text-yellow-600'}`} />
           </Div>
          </Div>

          <Div className="absolute right-[5px] top-[8px] flex">
            <OutsideClickHandler onOutsideClick={()=> handleMobileOutsideClick(data?._id)}>
              <Div
                onClick={() => handleMobileOpenAction(data?._id)}
                className="flex items-center justify-center hover:bg-gray-100 w-[2rem] h-[1.5rem] rounded-[3px]"
              >
                <ThreeDotsIcon />
              </Div>
              {mobileOpenActionItemId === data._id &&  (
                <ProductListAction 
                  data={data}
                  handleMobileOutsideClick={handleMobileOpenAction}
                  handleOutsideClick={handleOpenAction}
                  setIsFetched={setIsFetched}
                  className="!right-[40px]"
                />
              )}
            </OutsideClickHandler>
          </Div>
        </Div>
        ))}
      </Div>
      <TablePagination 
        className="mt-2 md:mt-0"
        itemsPerPage={8}
        totalItems={products.length}
        currentPage={Number(currentPage)}
       />

    </Div>
  );
}
