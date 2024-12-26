"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { Button, Div, InputField, SelectDropdown, Typography } from "@/interface/fragments";
import { AlertText, Popup } from "@/interface/components";
import ReactSwitch from "react-switch";
import { formatDateYYYYMMDD, formatOrderDate, formatOrderTime } from "@/utils";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { LoadingIcon } from "@/interface/icons";
import { enableTrackingLink, updateOrderStatus } from "@/@api/dashboard/orders.api";
import { toast } from "sonner";

type UpdateOrderStatusPopupProps = {
  open: boolean
  onClose:  () => void
  orderDetails: any
  setReFetch: Dispatch<SetStateAction<boolean>>
}

export default function OrderCustomTrackingLink({ open, onClose, orderDetails, setReFetch }: UpdateOrderStatusPopupProps) {

 const { update_unauthorized } = useUserStore()

 const [trackingLink, setTrackingLink] = useState<string | null >(null)
 const [loading, setLoading] = useState(false)
 const [errorMessage, setErrorMessage] = useState("empty")

  const handleCustomStatus = (e: any) => {
    setTrackingLink(e.target.value)
  }

  const handleUpdateOrderStatus = async () => {
    if(trackingLink === null && trackingLink === null){
      return toast.warning("Please add tracking link")
    }
    try {
      setLoading(true)
      await enableTrackingLink(orderDetails?._id, trackingLink)
      setLoading(false)
      setReFetch(prevData => !prevData)
      toast.success("Tracking link enabled")
      onClose()
      setErrorMessage("empty")
    } catch (error: any) {
      setErrorMessage("Something Went Wrong!")
      if (error.response.trackingLink === 401) {
       const cookies = new Cookies();
       cookies.remove("token", { path: "/" });
       update_unauthorized()
      }
      setLoading(false)
    }
  }

  return (
    <Popup open={open} onClose={onClose}>
      <Div className="w-[95vw] lg:w-[40vw] shadow  bg-white rounded-theme p-5 pt-4">
        <Div className="flex  justify-between border-b pb-2 flex-col">
          <Typography className="font-medium">Enable Delivery Partner Tracking Link</Typography>
          <Typography className="text-[13px]">When customers provide tracking details, enabling delivery partner tracking redirects them to your partner&#39;s tracking link.</Typography>
        </Div>
        <Div className="flex flex-col w-full">

          <Div className="flex flex-col w-full mt-[13px]">
            <InputField
              label="Tracking Link"
              onChange={handleCustomStatus}
              type="text" 
              placeHolder="Tracking Link" 
              className="w-full bg-gray-100 text-[13px]"
            />
          </Div>
          
          { errorMessage !== "empty" && (<AlertText text={errorMessage} variant="danger" className="mt-5" />)}

        </Div>
        <Div className="mt-[30px] flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="!h-[2rem] w-[5rem] border-black !bg-gray-200 hover:!bg-gray-300 !text-black"
          >
            Close
          </Button>
          <Button disabled={loading} onClick={handleUpdateOrderStatus} className="!h-[2rem] !w-[7rem]">
            {loading ? <LoadingIcon className="animate-spin" /> : "Enable"}
          </Button>
        </Div>
      </Div>
    </Popup>
  );
}
