"use client"

import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, InputField, Typography } from "@/interface/fragments";
import { LoadingIcon } from "@/interface/icons";
import { UpdateEmailTypes } from "@/types/dashboard/settings";
import { AlertText, Otp } from "@/interface/components";
import { getProfileInfo } from "@/@api/dashboard/settings.api";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { formValidation } from "@/utils/formValidation";
import { toast } from "sonner";
import { revalidateServerAction } from "@/app/actions";
import { sentOtp, updateEmail } from "@/@api/auth/auth.api";
import Cookies from "universal-cookie";

export default function UpdateEmail() {

  const { update_unauthorized } = useUserStore()

  // fetch default profile info
  useEffect( ()  => {
    const fetchData = async () => {
      try {
        const res = await getProfileInfo()
        setUpdateEmailData((prevData) => ({
          ...prevData,
          email: res.data.email,
        }))
        setCurrentEmail(res.data.email)
        setDefaultEmailLoading(false)
      } catch (error: any) {
        if (error.response.status === 401) {
            const cookies = new Cookies();
            cookies.remove("token", { path: "/" });
            update_unauthorized()
          }
        setDefaultEmailLoading(false)
        setErrorMessage("failed to load your your current email")
      }
    }

    fetchData()
  }, [])
  
  const InitialUpdateEmailData = {
    email: ""
  }
  
  const [step, setStep] = useState<"stepOne" | "stepTwo">('stepOne')
  const [defaultEmailLoading, setDefaultEmailLoading] = useState(true)
  const [currentEmail, setCurrentEmail] = useState("")
  const [updateEmailData, setUpdateEmailData] = useState<UpdateEmailTypes>(InitialUpdateEmailData)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [formErrors, setFormErrors] = useState<any>()
  const [otp, setOtp] = useState<any>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setErrorMessage("empty")
      setUpdateEmailData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
  }

  const handleOtpSent = async () => {
    // form validation
    if(currentEmail === updateEmailData.email) return
    if(defaultEmailLoading) return
    const newFormErrors = formValidation(updateEmailData)
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return
    setLoading(true)

    try {
        await sentOtp(currentEmail)
        setStep("stepTwo")
        setLoading(false)
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
        return
      }
      setErrorMessage("")
    }
  }

  const handleUpdate = async () => {
    // otp validation
    if(otp === undefined || otp.length !== 4) return setErrorMessage("Please enter otp")
    setLoading(true)

    // update email info api call
    try {
      await updateEmail(updateEmailData.email, otp, currentEmail)
      setErrorMessage("empty")
      setLoading(false)
      toast.success("Email Updated successfully")
      revalidateServerAction("store")
      setStep("stepOne")
    } catch (error: any) {
      if(error.response.status === 400){
        setOtp("")
        setLoading(false)
        toast.error(error.response.data.message)
        setErrorMessage(error.response.data.message)
        if(error.response.data.message === "this email is already used"){
            setStep("stepOne")
          }
        return 
       }
       setOtp("")
       setLoading(false)
       setErrorMessage("something went wrong")
    }
  }


  return (
    <>
    { step === "stepTwo" && (
      <Div  className="w-full xl:w-[25rem] rounded-theme bg-white p-3 pt-2 pb-[2rem]" >
        <Otp email={currentEmail} otp={otp} onChange={setOtp} containerStyle="!mt-[5px]" /> 
        <Button disabled={loading} onClick={handleUpdate} className="mt-4 w-full" >
        {loading ? <LoadingIcon className="animate-spin" /> : "Submit"}
        </Button>
        { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
      </Div>
    )}
    {  step === "stepOne" && <Div className="w-full xl:w-[55%] rounded-theme bg-white p-3 pt-2 pb-[2rem]">
      <Typography className="font-medium text-[14px]">Update Email</Typography>
      <Div className="mt-[8px] flex flex-col gap-[4px]">
        { defaultEmailLoading === true && <Div className="flex flex-col gap-[10px]" >
        <Div className="flex flex-col gap-[3px]" >
          <Typography className="text-[13px]" >Email Address</Typography>
          <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
        </Div>
        </Div>
        }

        { defaultEmailLoading === false && <>
        <InputField
          label="Enter Your New Email"
          name="email"
          type="email"
          placeHolder="Enter Your New Email"
          containerStyle="w-full mt-2"
          className="!w-full bg-gray-100 mt-[2px]"
          defaultValue={updateEmailData.email}
          onChange={handleChange}
          invalid={!!formErrors?.email}
          errorMessage={formErrors?.email}
        />
        </>}
        <Button disabled={loading}  onClick={handleOtpSent} className="mt-8">
        {loading ? <LoadingIcon className="animate-spin" /> : "Update"}
        </Button>
      </Div>
      { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
    </Div>}
    </>
  );
}
