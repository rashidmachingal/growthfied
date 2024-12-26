"use client"

import { ChangeEvent, useState } from "react";
import { Button, Div, InputField, PlainButton, Typography } from "@/interface/fragments";
import { LoadingIcon } from "@/interface/icons";
import { UpdatePasswordDataTypes } from "@/types/dashboard/settings";
import { AlertText, Otp } from "@/interface/components";
import { formValidation } from "@/utils/formValidation";
import { toast } from "sonner";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import Cookies from "universal-cookie";
import { checkCurrentPasswordValid, sentOtp, updatePassword } from "@/@api/auth/auth.api";

export default function UpdatePassword() {

  const InitalUpdatePasswordData = {
    current_password: "",
    new_password: "",
    confirm_password: ""
  }

  const { update_unauthorized } = useUserStore()

  const [step, setStep] = useState<"stepOne" | "stepTwo">('stepOne')
  const [updatePasswordData, setUpdatePasswordData] = useState<UpdatePasswordDataTypes>(InitalUpdatePasswordData)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [formErrors, setFormErrors] = useState<any>()
  const [email, setEmail] = useState<string>("")
  const [otp, setOtp] = useState<any>()
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
     setErrorMessage("empty")
     if (formErrors !== undefined) {
      const { [e.target.name]: _, ...rest } = formErrors;
      setFormErrors(rest);
     }
      setUpdatePasswordData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
  }

  const handleCheckCurrentPasswordValid = async () => {
    // form validation
    const newFormErrors = formValidation(updatePasswordData)
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return

    setLoading(true)

    // check current password valid api call
    try {
      const res = await checkCurrentPasswordValid(updatePasswordData.current_password)
      setErrorMessage("empty")
      setEmail(res.data.email)
      await sentOtp(res.data.email)
      setStep("stepTwo")
      setLoading(false)
    } catch (error: any) {
      if (error.response.status === 403){
        setLoading(false)
        toast.error("Current password is invalid!")
        setErrorMessage(error.response.data.message)
        return 
      }
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

  const handleUpdatePassword = async () => {
    // otp validation
    if(otp === undefined || otp.length !== 4) return setErrorMessage("Please enter otp")

    setLoading(true)

    // update password api call
    try {
      const cookies = new Cookies();
      const res = await updatePassword(updatePasswordData.new_password, updatePasswordData.current_password, otp)
      toast.success("Password updated successfully")
      setStep("stepOne")
      cookies.set("token", res.data.token, { path: "/", maxAge: 15552000 })
      setLoading(false)
      setErrorMessage("empty")
    } catch (error: any) {
      if (error.response.status === 400){
        setLoading(false)
        toast.error(error.response.data.message)
        setErrorMessage(error.response.data.message)
        return 
      }
      if (error.response.status === 403){
        setLoading(false)
        toast.error("Current password is invalid!")
        setErrorMessage(error.response.data.message)
        return 
      }
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
  

  return (
    <>
    { step === "stepTwo" && (
      <Div  className="mt-4 w-full xl:w-[25rem] rounded-theme bg-white p-3 pt-2 pb-[2rem]" >
        <Otp email={email} otp={otp} onChange={setOtp} containerStyle="!mt-[5px]" /> 
        <Button disabled={loading} onClick={handleUpdatePassword} className="mt-4 w-full" >
        {loading ? <LoadingIcon className="animate-spin" /> : "Submit"}
        </Button>
        { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
      </Div>
    )}
    { step === "stepOne" && 
    
    <Div className="w-full xl:w-[55%] rounded-theme bg-white p-3 pt-2 pb-[2rem]">
      <Typography className="font-medium text-[14px]">Update Password</Typography>
      <Div className="mt-[8px]">
        <InputField
          label="Current Password"
          name="current_password"
          placeHolder="Enter a current password"
          type={`${showPass ? "text" : "password"}`}
          containerStyle="mt-2"
          className="w-full text-[14px] mt-[2px] bg-gray-100"
          onChange={handleChange}
          invalid={!!formErrors?.current_password}
          errorMessage={formErrors?.current_password}
        />
        <InputField
          label="New Password"
          name="new_password"
          placeHolder="Enter a New password"
          type={`${showPass ? "text" : "password"}`}
          containerStyle="mt-2"
          className="w-full text-[14px] mt-[2px] bg-gray-100"
          onChange={handleChange}
          invalid={!!formErrors?.new_password}
          errorMessage={formErrors?.new_password}
        />
        <InputField
          label="Re-Type New Password"
          name="confirm_password"
          placeHolder="Re-type New Password"
          type={`${showPass ? "text" : "password"}`}
          containerStyle="mt-2"
          className="w-full text-[14px] mt-[2px] bg-gray-100"
          onChange={handleChange}
          invalid={!!formErrors?.confirm_password}
          errorMessage={formErrors?.confirm_password}
        />
        <Div className="flex justify-end w-full" >
        <PlainButton className="text-[12px] cursor-pointer hover:underline" onClick={()=> setShowPass((prevState)=> !prevState)} >Show Password</PlainButton>
        </Div>
        <Button disabled={loading} onClick={handleCheckCurrentPasswordValid} className="mt-8 w-full">
          {loading ? <LoadingIcon className="animate-spin" /> : "Continue"}
        </Button>
      </Div>
      { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
    </Div>}
    </>
  );
}
