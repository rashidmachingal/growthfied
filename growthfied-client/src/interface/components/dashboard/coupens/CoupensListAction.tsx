"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Div, Typography } from "@/interface/fragments";
import { deleteCoupen } from "@/@api/dashboard/coupens.api";
import { toast } from "sonner";
import { DeleteConfirmPopup } from "@/interface/components";
import { useEditCoupenDefaultDataStore } from "@/zustand/dashboard/coupenStore";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

type CoupensListActionProps = {
  data: any
  className?: string
  setIsFetched: Dispatch<SetStateAction<boolean>>
  handleOutsideClick: (id: string) => void
  handleMobileOutsideClick: (id: string) => void
}

export default function CoupensListAction({ className, data, setIsFetched, handleOutsideClick, handleMobileOutsideClick }: CoupensListActionProps) {

  const { update_edit_coupen_default_data, update_fetch_status } = useEditCoupenDefaultDataStore()
  const { update_unauthorized } = useUserStore()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [confirmPopupOpen, setConfirmOpen] = useState(false)
  const currentPage = searchParams.get("p") ?? "1"

  const handleRemove =  async () => {
    setLoading(true)
    try {
      await deleteCoupen(data._id)
      toast.success("Coupen removed successfully")
      setIsFetched(prev=> !prev)
      setLoading(false)
    } catch (error: any) {
      if (error.response.status === 401) {
       const cookies = new Cookies();
       cookies.remove("token", { path: "/" });
       update_unauthorized()
      }
      toast.error("Failed to remove coupen!")
      setLoading(false)
    }
  }

  const handleEditClick = () => {
    if(update_edit_coupen_default_data){
      update_edit_coupen_default_data(data)
    }
    if(update_fetch_status){
      update_fetch_status(false)
    }
  }

  return (
    <>
    <DeleteConfirmPopup 
      title="Coupen"  
      open={confirmPopupOpen} 
      loading={loading} 
      onSubmit={handleRemove}
      onClose={()=> setConfirmOpen(false)}
      type="delete"
      content={`Coupen Code: ${data.coupen_code}`}
    />
     <Div className={`w-[12rem] bg-white absolute right-[10px] top-[30px] border rounded-theme flex flex-col p-[8px] gap-[3px] ${className} z-50`}>
      <Link href={`/dashboard/coupens/edit/${data?._id}?p=${currentPage}`} onClick={handleEditClick} className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">Edit</Typography>
      </Link>
      <Div onClick={()=> setConfirmOpen(true)} className="hover:bg-[#d3d3d356] px-2 rounded-[3px] h-[2rem] flex items-center cursor-pointer select-none">
        <Typography className="text-[13px]">Delete</Typography>
      </Div>
    </Div>
    </>
  );
}
