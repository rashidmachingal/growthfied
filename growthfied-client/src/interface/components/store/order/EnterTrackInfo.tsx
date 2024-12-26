"use client"

import { ChangeEvent, Dispatch, SetStateAction, useCallback } from "react";
import { Button, Div, InputField, Typography } from "@/interface/fragments";
import { LoadingIcon } from "@/interface/icons";
import { useSearchParams } from "next/navigation";

type EnterTrackInfoProps = {
  inputData: {
    phone_number: string;
    order_id: string;
  }
  setInputData: Dispatch<SetStateAction<{
    phone_number: string;
    order_id: string;
  }>>
  fetchTrackingDetails: () => void
  loading: boolean
  formErrors: {
    phone_number: boolean;
    order_id: boolean;
  }
}

export default function EnterTrackInfo({ inputData, setInputData, fetchTrackingDetails, loading, formErrors }: EnterTrackInfoProps) {

  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputData((prevData => ({
      ...prevData,
      [e.target.name] : e.target.value
    })))
  }

  return (
    <>
    <Typography className="font-medium" >Track Your Order</Typography>
       <Typography className="text-[12px] text-center" >Enter your order Id and mobile number to track your order</Typography>
       <Div className="w-[95%] md:w-[35rem] shadow mt-2 rounded-[5px] border-t border-t-gray-100 p-4" >
          <InputField 
            type="text" 
            name="order_id"
            label="Order Id" 
            placeHolder="Eg: 121345" 
            className="w-full bg-gray-100 mt-[2px] text-[12px]"
            defaultValue={inputData.order_id}
            invalid={!!formErrors?.order_id}
            errorMessage={"*Please enter order id"}
            onChange={handleChange}
          />
          <InputField 
            type="text" 
            name="phone_number"
            innerText="+91" 
            label="Phone Number" 
            placeHolder="Phone Number" 
            containerStyle="w-full mt-[10px]"
            className="w-full text-[13px] mt-[3px] bg-gray-100 pl-[2.5rem]"
            innerTextStyle="text-[14px] top-[12px] left-[5px] border-r pr-[5px]"
            errorMessage={"*Please enter phone number"}
            invalid={!!formErrors?.phone_number}
            defaultValue={inputData.phone_number}
            onChange={handleChange}
          />
          <Button disabled={loading} onClick={fetchTrackingDetails} className="mt-5 w-full" >
            {loading ? <LoadingIcon className="animate-spin" /> : "Track Order"}
          </Button>
       </Div>
    </>
  )
}
