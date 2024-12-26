"use client"

import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, InputField, Typography } from "@/interface/fragments";
import { LoadingIcon } from "@/interface/icons";
import { AlertText } from "@/interface/components";
import { formValidation } from "@/utils/formValidation";
import { getDefaultDeliveryCharge, updateDeliveryCharge } from "@/@api/dashboard/settings.api";
import { toast } from "sonner";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

export default function UpdateDeliveryCharge() {

    const { update_unauthorized } = useUserStore()

    const [deliveryCharge, setDeliveryCharge] = useState<String>()
    const [loading, setLoading] = useState(false)
    const [fetchingLoading, setFetchingLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string>("empty")
    const [formErrors, setFormErrors] = useState<any>()

    // fetch default delivery charge
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getDefaultDeliveryCharge()
          setDeliveryCharge(res.data.default_delivery_charge)
          setFetchingLoading(false)
        } catch (error: any) {
          if (error.response.status === 401) {
            const cookies = new Cookies();
            cookies.remove("token", { path: "/" });
            update_unauthorized()
          }
          setFetchingLoading(false)
          setErrorMessage("failed to load delivery charge")
        }
      }
      fetchData()
    }, [update_unauthorized])
    

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    setDeliveryCharge(e.target.value);
  }

  const handleUpdateDeliveryCharge = async () => {
    setErrorMessage("empty")

    // form validation
    const newFormErrors = formValidation({ delivery_charge: deliveryCharge })
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return

    setLoading(true)

    // update delivery charge api call
    try {
      await updateDeliveryCharge(Number(deliveryCharge))
      setLoading(false)
      toast.success("Delivery Charge updated successfully")
    } catch (error: any) {
       toast.error("Delivery Charge update failed")
       if (error.response.status === 401) {
         const cookies = new Cookies();
         cookies.remove("token", { path: "/" });
         update_unauthorized()
        }
       if(error?.response){
         setErrorMessage(error?.response?.data?.message)
         setLoading(false)
       }else{
        setErrorMessage("something went wrong")
        setLoading(false)
       }
    }
  }

  return (
    <Div className="w-full xl:w-[55%] rounded-theme bg-white p-3 pt-2 pb-[1.8rem]">
      <Typography className="font-medium text-[14px]">Delivery Charge</Typography>
      { fetchingLoading === true && (<Div className="flex flex-col gap-[3px]" >
        <Typography className="text-[13px]" >Enter delivery charge for per order</Typography>
        <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
      </Div>)}
      { fetchingLoading === false && (<Div className="flex flex-col mmd:flex-row justify-between w-full gap-3">
      <InputField
        type="number"
        name="delivery_charge"
        label="Enter delivery charge for per order"
        innerText="₹"
        placeHolder="0.00"
        innerTextStyle="left-3 mt-[2px]"
        containerStyle="mt-2 w-full"
        className="w-full mt-[0px] pl-[1.6rem] lowercase bg-gray-100"
        defaultValue={Number(deliveryCharge)}
        invalid={!!formErrors?.delivery_charge}
        errorMessage={formErrors?.delivery_charge}
        onChange={handleChange}
      />
      <Button disabled={loading} onClick={handleUpdateDeliveryCharge} className="mmd:mt-[29px] text-[10px] w-full mmd:w-[10rem]">
        {loading ? <LoadingIcon className="animate-spin" /> : "Update"}
      </Button>
      </Div>)}

    { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
    </Div>
  );
}
