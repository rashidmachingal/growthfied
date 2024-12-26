"use client"

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, InputField, Span, Typography } from "@/interface/fragments";
import {  LoadingIcon } from "@/interface/icons";
import { UpdatePaymentMethodDataTypes } from "@/types/dashboard/settings";
import { AlertText, ConfirmPopup} from "@/interface/components";
import { disableOnlinePayment, enabledPhonePePg, getPaymentMethodInfo, switchCod  } from "@/@api/dashboard/settings.api";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { formValidation } from "@/utils/formValidation";
import { toast } from "sonner";
import Cookies from "universal-cookie";
import ReactSwitch from "react-switch";
import Link from "next/link";
import RazorpayImage from "../../../../../public/settings/razorpay_logo.svg"

export default function UpdatePaymentMethod() {

  const { update_unauthorized, username } = useUserStore()

  // fetch default payment method data
  useEffect( ()  => {
    const fetchData = async () => {
      try {
        const res = await getPaymentMethodInfo()
        setUpdatePaymentMethodData(res.data.payment_method)
        setDefaultSeoInfoLoading(false)
        if(res.data.payment_method.online.enabled) setDisplayOnlineSwitch(true) 
        console.log(res.data.payment_method)
      } catch (error: any) {
        if (error.response.status === 401) {
          const cookies = new Cookies();
          cookies.remove("token", { path: "/" });
          update_unauthorized()
        }
        setDefaultSeoInfoLoading(false)
        setErrorMessage("failed to load your payment method info")
      }
    }

    fetchData()
  }, [update_unauthorized])
  

  const InitialPaymentMethodData = {
    cod: true,
    online: {
      enabled: true,
      pg_name: "Razorpay"
    }
  }

  const [deafultPaymentMethodInfoLading, setDefaultSeoInfoLoading] = useState(true)
  const [updatePaymentMethodData, setUpdatePaymentMethodData] = useState<UpdatePaymentMethodDataTypes>(InitialPaymentMethodData)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [formErrors, setFormErrors] = useState<any>()
  const [dummyEnableOnline, setDummyEnableOnline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const [alertPopup, setAlertPopup] = useState(false)
  const [editKeys, setEditKeys] = useState(false)
  const [phonePePgData, setPhonePgData] = useState({
    key_id: "",
    key_secret: ""
  })
  const [displayOnlineSwitch, setDisplayOnlineSwitch] = useState(false)

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    setPhonePgData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
  }

  const handleEnableOnlinePayment = async () => {
    setErrorMessage("empty")

    // form validation
    const newFormErrors = formValidation(phonePePgData)
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return

    setLoading(true)


    // update payment method data api call
    try {
      await enabledPhonePePg({
        ...phonePePgData,
        pg_name: updatePaymentMethodData.online.pg_name,
        enabled: updatePaymentMethodData.online.enabled,
      })
      setUpdatePaymentMethodData((prevData => ({
        ...prevData,
        online: {
          pg_name: "Razorpay",
          enabled: true
        }
      })))
      setDummyEnableOnline(false)
      setErrorMessage("empty")
      setLoading(false)
      toast.success("Razorpay Payment Gateway Added Successfully")
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
        return
      }
      setLoading(false)
      setErrorMessage("something went wrong")
    }
  }

  const handleSwitchChange = async (type: "cod" | "online") => {
    if(type === "cod"){
      setUpdatePaymentMethodData((prevData) => ({
        ...prevData, 
        cod: !prevData.cod
      }))
      try {
        const res = await switchCod(!updatePaymentMethodData.cod)
        if(res.data.status){
          toast.success("Cash on Delivery Enabled")
        }else{
          toast.info("Cash on Delivery Disabled!")
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          const cookies = new Cookies();
          cookies.remove("token", { path: "/" });
          update_unauthorized()
          return
        }
        toast.error("Changes you made failed!")
        setUpdatePaymentMethodData((prevData) => ({
          ...prevData, 
          cod: !prevData.cod
        }))
      }
    }
    if(type === "online"){
      setDisplayOnlineSwitch((prevData => !prevData))
      if(updatePaymentMethodData.online.enabled){
        setAlertPopup(true)
      }else{
        setDummyEnableOnline((prevData => !prevData))
      }
    }
  }

  const handleDisableOnlinePayment = async () => {
    try {
      setLoading(true)
      await disableOnlinePayment()
      toast.info("Online Payment Disabled!")
      setDummyEnableOnline(false)
      setLoading(false)
      setAlertPopup(false)
      setUpdatePaymentMethodData((prevData) => ({
        ...prevData, 
        online: {
          enabled: false,
          pg_name: prevData.online.pg_name
        }
      }))
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
        return
      }
      setLoading(false)
      setAlertPopup(false)
      toast.error("Changes you made failed!")
    }
  }

  return (
    <>
    <ConfirmPopup
     title="Are you sure?"
     content="Pressing confirm will disable online payment. To re-enable it, you'll need to add the keys again."
     buttonText="Confirm"
     loading={loading}
     open={alertPopup}
     onClose={()=> setAlertPopup(false)}
     onSubmit={handleDisableOnlinePayment}
    />
    <Div className="w-full xl:w-[55%] rounded-theme bg-white p-3 pt-2 pb-[2rem]">
      <Typography className="font-medium text-[14px]">Payment Methods</Typography>
      <Div className="mt-[8px] flex flex-col gap-[4px]">
        
        { deafultPaymentMethodInfoLading === true && <Div className="flex flex-col gap-[10px]" >
        <Div className="flex flex-col gap-[3px]" >
          <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
        </Div>
        <Div className="flex flex-col gap-[3px]" >
          <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
        </Div>
        </Div>}

        { deafultPaymentMethodInfoLading === false && (
          <>
           <Div className="flex flex-col gap-[0px] border p-3 rounded-theme" >
            <Div className="w-full flex justify-between gap-[3px]" >
            <Typography className="text-[13px]" >Cash on Delivery</Typography>
             <ReactSwitch
              width={38}
              height={20}
              boxShadow="0px 1px 5px #00000099"
              onColor="#333"
              checkedIcon={false}
              uncheckedIcon={false}
              checked={updatePaymentMethodData.cod}
              onChange={()=> handleSwitchChange("cod")}
              />
            </Div>  
           </Div>
            <Div className="flex flex-col border p-3 rounded-theme mt-[5px]" >
             <Div className="flex justify-between w-full" >
              <Typography className="text-[14px]" >Online Payment (2% Commision)</Typography>
              <ReactSwitch
               width={38}
               height={20}
               boxShadow="0px 1px 5px #00000099"
               onColor="#333"
               checkedIcon={false}
               uncheckedIcon={false}
               checked={displayOnlineSwitch}
               onChange={()=> handleSwitchChange("online")}
              />
              </Div>
              <Div className="mt-[5px]" >
                <Div className="p-[5px] w-[8rem] flex" >
                 <Image src={RazorpayImage} width={100} height={50} alt="phonepe" />
                </Div>
              </Div>
              { updatePaymentMethodData.online.enabled && (
                <Div className="mt-[5px]" >
                <Div className="flex items-center justify-between" >
                 <Typography className="text-[12px] mt-[2px] text-green-600" >Your Online Payment is Enabled</Typography>
                 {/* <Button onClick={()=> setEditKeys((prevData => (!prevData)))} className="!h-[2rem]" >
                  Edit Keys
                 </Button> */}
                </Div>
              </Div>
              )}

              { dummyEnableOnline && (
                <Div className="mt-[5px]" >
                <Div>
                 <Typography className="text-[12px] mt-1" >
                  Create an account on <Link target="_blank" className="text-blue-600" href="https://rzp.io/rzp/dsfqXiK" >Razorpay</Link>, complete the KYC process, and enter these keys
                 </Typography>
                </Div>
                <Div>
                <InputField
                  label="Key Id"
                  name="key_id"
                  placeHolder="Enter Key Id"
                  type="password"
                  containerStyle="mt-2"
                  className="w-full text-[14px] mt-[2px] bg-gray-100"
                  onChange={handleChange}
                  invalid={!!formErrors?.key_id}
                  errorMessage={formErrors?.key_id}
                />
                <InputField
                  label="Key Secret"
                  name="key_secret"
                  placeHolder="Enter Key Secret"
                  type="password"
                  containerStyle="mt-2"
                  className="w-full text-[14px] mt-[2px] bg-gray-100"
                  onChange={handleChange}
                  invalid={!!formErrors?.key_secret}
                  errorMessage={formErrors?.key_secret}
                />
                <Button onClick={handleEnableOnlinePayment} disabled={loading} className="mt-3 w-full" >
                  {loading ? <LoadingIcon className="animate-spin" /> : "Confirm Keys" }
                </Button>
                </Div>
              </Div>
              )}

              {/* { editKeys && (
                <Div className="mt-[5px]" >
                <Div>
                 <Typography className="text-[12px] mt-1" >Contact PhonePe Payment Gateway Support Team for Getting these Keys</Typography>
                </Div>
                <Div>
                <InputField
                  label="Merchant ID (MID)"
                  name="mid"
                  placeHolder="Enter MID"
                  type="text"
                  containerStyle="mt-2"
                  className="w-full text-[14px] mt-[2px] bg-gray-100"
                  onChange={handleChange}
                  invalid={!!formErrors?.mid}
                  errorMessage={formErrors?.mid}
                />
                <InputField
                  label="Salt Key"
                  name="salt_key"
                  placeHolder="Enter Salt Key"
                  type="text"
                  containerStyle="mt-2"
                  className="w-full text-[14px] mt-[2px] bg-gray-100"
                  onChange={handleChange}
                  invalid={!!formErrors?.salt_key}
                  errorMessage={formErrors?.salt_key}
                />
                <InputField
                  label="Salt Key Index"
                  name="salt_key_index"
                  placeHolder="Enter Salt Key Index"
                  type="number"
                  containerStyle="mt-2"
                  className="w-full text-[14px] mt-[2px] bg-gray-100"
                  onChange={handleChange}
                  invalid={!!formErrors?.salt_key_index}
                  errorMessage={formErrors?.salt_key_index}
                />
                <Button onClick={handleEnableOnlinePayment} disabled={loading} className="mt-3 w-full" >
                  {loading ? <LoadingIcon className="animate-spin" /> : "Enable Online Payment" }
                </Button>
                </Div>
              </Div>
              )} */}
            </Div>
            </>
        )}

      </Div>

      <Div>
        <Typography className="text-[13px] text-center mt-6" >Contact Support Team for If you have questions with online Payment</Typography>
      </Div>

      { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
    </Div>
    </>
  );
}
