"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { Div, Typography } from "@/interface/fragments";
import { DeleteConfirmPopup, UpdateCategoryPopup } from "@/interface/components";
import { deleteCategory, updateCategoryStatus } from "@/@api/dashboard/categories.api";
import { toast } from "sonner";
import { revalidateServerAction } from "@/app/actions";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

type CategoriesListActionProps = {
  className?: string
  data: any
  setIsFetched: Dispatch<SetStateAction<boolean>>
  handleOutsideClick: (id: string) => void
  handleMobileOutsideClick: (id: string) => void
}

export default function CategoriesListAction({ className, data, setIsFetched, handleOutsideClick, handleMobileOutsideClick }: CategoriesListActionProps) {

  const { update_unauthorized } = useUserStore()
   
  const [confirmPopupOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updatePopupOpen, setUpdatePopupOpen] = useState(false)

  const handleRemove =  async () => {
    setLoading(true)
    try {
      await deleteCategory(data._id, data.image)
      revalidateServerAction("category")
      toast.success("Category removed successfully")
      setIsFetched(prev=> !prev)
      setLoading(false)
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
      }
      toast.error("Failed to remove category!")
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    handleOutsideClick(data._id)
    handleMobileOutsideClick(data._id)
    toast.loading("Category status updating...", {id: 1})
    try {
      await updateCategoryStatus(data._id, data.status)
      revalidateServerAction("category")
      toast.dismiss(1)
      toast.success("Category status updated", {id: 2})
      setIsFetched(prev=> !prev)
    } catch (error: any) {
      if (error.response.status === 401) {
       const cookies = new Cookies();
       cookies.remove("token", { path: "/" });
       update_unauthorized()
      }
      toast.error("Failed to remove category!")
    }
  }

  return (
    <>
    <DeleteConfirmPopup 
      title="Category"  
      open={confirmPopupOpen} 
      loading={loading} 
      onSubmit={handleRemove}
      onClose={()=> setConfirmOpen(false)}
      type="delete"
      content={`${data.category_name}`}
    />
    <UpdateCategoryPopup 
      open={updatePopupOpen} 
      onClose={()=> setUpdatePopupOpen(false)} 
      setIsFetched={setIsFetched}
      defaultData={data}
      handleOutsideClick={handleOutsideClick}
      handleMobileOutsideClick={handleMobileOutsideClick}
    />
    <Div className={`w-[12rem] bg-white absolute lg:left-[-54px] top-[20px] border rounded-theme flex flex-col p-[8px] gap-[3px] z-20 ${className}`}>
      <Div onClick={handleStatusUpdate} className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">{data.status === "Active" ? "Revert to draft" : "Make active"}</Typography>
      </Div>
      <Div onClick={()=> setUpdatePopupOpen(true)} className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">Edit</Typography>
      </Div>
      <Div onClick={()=> setConfirmOpen(true)} className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">Delete</Typography>
      </Div>
    </Div>
    </>
  );
}
