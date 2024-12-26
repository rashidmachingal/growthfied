"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { Button, Div, InputField, SelectDropdown, Typography } from "@/interface/fragments";
import { AlertText, Popup } from "@/interface/components";
import { formatDateYYYYMMDD, formatOrderDate, formatOrderTime } from "@/utils";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { LoadingIcon } from "@/interface/icons";
import { updateOrderStatus } from "@/@api/dashboard/orders.api";
import { toast } from "sonner";
import ReactSwitch from "react-switch";
import Cookies from "universal-cookie";

type UpdateOrderStatusPopupProps = {
  open: boolean
  onClose:  () => void
  orderDetails: any
  setReFetch: Dispatch<SetStateAction<boolean>>
}

export default function UpdateOrderStatusPopup({ open, onClose, orderDetails, setReFetch }: UpdateOrderStatusPopupProps) {

 const { update_unauthorized } = useUserStore()
 const [customMessageOpen, setCustomMessageOpen] = useState(false)
 const [sortDefaultValue, setSortDefaultValue] = useState({
    value: "select",
    label: "Select Status",
 });
 const [expectedDelivery, setExpectedDelivery] = useState<string|null>(null)
 const [status, setStatus] = useState<string | null >(null)
 const [loading, setLoading] = useState(false)
 const [errorMessage, setErrorMessage] = useState("empty")

 const sortOptions = [
    {
      label: "Item Shipped",
      value: "Shipped",
    },
    {
      label: "Order Completed",
      value: "Completed",
    }
  ];

  const handleSelectChange = (e: any) => {
    setStatus(e.value)
  }

  const handleCustomStatus = (e: any) => {
    setStatus(e.target.value)
  }

  const handleExpectedDeliveryChange = (e: any) => {
    setExpectedDelivery(e.target.value)
  }

  const handleUpdateOrderStatus = async () => {
    if(expectedDelivery === null && status === null){
      return toast.warning("Please change status or expected delivery")
    }
    try {
      setLoading(true)
      const orderStatusUpdateData = {
        expected_delivery_date: expectedDelivery === null ? null : `${expectedDelivery}T00:00:00.000Z` ,
        order_progress: {
          status: status,
          date: formatOrderDate(new Date()),
          time: formatOrderTime(new Date())
        }
      }
      await updateOrderStatus(orderDetails?._id, orderStatusUpdateData)
      setLoading(false)
      setReFetch(prevData => !prevData)
      toast.success("Order Status Updated")
      onClose()
      setStatus(null)
      setExpectedDelivery(null)
      setErrorMessage("empty")
      setCustomMessageOpen(false)
    } catch (error: any) {
      setErrorMessage("Something Went Wrong!")
      if (error.response.status === 401) {
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
        <Div className="flex items-center justify-between border-b pb-2">
          <Typography className="font-medium">Update Order Status</Typography>
        </Div>
        <Div className="flex flex-col w-full mt-[15px]">
         { customMessageOpen === false && <>
           <InputField
              type="date"
              label="Expected Delivery Date"
              containerStyle="!w-full border-[#33333321]"
              className="!h-[2.3rem] w-full bg-gray-100"
              defaultValue={formatDateYYYYMMDD(orderDetails?.expected_delivery_date)}
              onChange={handleExpectedDeliveryChange}
            />
            <Div className="mt-3" >
            <Typography className="text-[13px] ml-1" >Order Status</Typography>
           <SelectDropdown
            options={sortOptions}
            onChange={handleSelectChange}
            defaultValue={sortDefaultValue}
            setDefaultValue={setSortDefaultValue}
           />
           </Div>
          </>}

            <Div className="flex justify-between mt-[18px]" >
             <Typography className="text-[13px]" >Custom Status</Typography>
             <ReactSwitch width={38} height={20} boxShadow="0px 1px 5px #00000099"  onColor="#333" checkedIcon={false} uncheckedIcon={false} checked={customMessageOpen} onChange={()=> setCustomMessageOpen(prev=> !prev)} />
            </Div>

          { customMessageOpen && <Div className="flex flex-col w-full mt-[13px]">
            <InputField
              onChange={handleCustomStatus}
              type="text" 
              placeHolder="Example: Out for delivery" 
              className="w-full bg-gray-100 text-[13px]"
            />
          </Div>}
          
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
            {loading ? <LoadingIcon className="animate-spin" /> : "Update"}
          </Button>
        </Div>
      </Div>
    </Popup>
  );
}
