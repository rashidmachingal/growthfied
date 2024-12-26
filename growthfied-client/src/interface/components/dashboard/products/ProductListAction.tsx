"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Div, Typography } from "@/interface/fragments";
import { DeleteConfirmPopup } from "@/interface/components";
import { toast } from "sonner";
import { deleteProduct, updateProductStatus } from "@/@api/dashboard/products.api";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { useEditProductDefaultDataStore } from "@/zustand/dashboard/productStore";
import { revalidateServerAction } from "@/app/actions";
import { DOMAIN_NAME } from "../../../../../config";
import Cookies from "universal-cookie";

type ProductListActionProps = {
  className?: string
  data: any
  setIsFetched: Dispatch<SetStateAction<boolean>>
  handleOutsideClick: (id: string) => void
  handleMobileOutsideClick: (id: string) => void
}

export default function ProductListAction({ className, data, setIsFetched, handleOutsideClick, handleMobileOutsideClick }: ProductListActionProps) {

  const { update_edit_product_default_data, update_fetch_status } = useEditProductDefaultDataStore()
  const { username, update_unauthorized } = useUserStore()
  const searchParams = useSearchParams()
  
  const [confirmPopupOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const currentPage = searchParams.get("page") ?? '1'

  const handleRemove =  async () => {
    setLoading(true)
    try {
      await deleteProduct(data._id, data)
      revalidateServerAction("product")
      toast.success("Product removed successfully")
      setIsFetched(prev=> !prev)
      setLoading(false)
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
      }
      toast.error("Failed to remove product!")
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    handleOutsideClick(data._id)
    handleMobileOutsideClick(data._id)
    toast.loading("Product status updating...", {id: 1})
    try {
      await updateProductStatus(data._id, data.status)
      toast.dismiss(1)
      revalidateServerAction("product")
      toast.success("Product status updated", {id: 2})
      setIsFetched(prev=> !prev)
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
        }
      toast.error("Failed to remove product!")
    }
  }

  const handleEditClick = () => {
    if(update_edit_product_default_data) update_edit_product_default_data(data)
    if(update_fetch_status) update_fetch_status(false)
  }

  return (
    <>
    <DeleteConfirmPopup 
      title="Product"  
      open={confirmPopupOpen} 
      loading={loading} 
      onSubmit={handleRemove}
      onClose={()=> setConfirmOpen(false)}
      type="delete"
      content={`${data?.title}`}
    />
    <Div className={`w-[12rem] bg-white absolute lg:left-[-120px] top-[20px] border rounded-theme flex flex-col p-[8px] gap-[3px] z-20 ${className}`}>
      <Div onClick={handleStatusUpdate} className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">{data.status === "Active" ? "Revert to draft" : "Make active"}</Typography>
      </Div>
      <Link onClick={handleEditClick} href={`/dashboard/products/edit/${data?._id}?p=${currentPage}`} className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">Edit</Typography>
      </Link>
      <Link target="_blank" href={`https://${username}.${DOMAIN_NAME}/product/${data?.slug}`} className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">Visit on store</Typography>
      </Link>
      <Div onClick={()=> setConfirmOpen(true)} className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">Delete</Typography>
      </Div>
    </Div>
    </>
  );
}
