"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChangeEvent, FormEventHandler, useState } from "react";
import { Button, Div, Form, InputField, PlainButton, Typography } from "@/interface/fragments";
import { AlertText, Otp } from "@/interface/components";
import { ResetPasswordTypes } from "@/types/auth";
import { formValidation } from "@/utils/formValidation";
import { LoadingIcon } from "@/interface/icons";
import { forgotResetPassword, sentOtp, submitOtp } from "@/@api/auth/auth.api";
import { toast } from "sonner";

export default function ResetPassword() {

    const router = useRouter()
    
    const InitialResetPasswordData = {
      email: "",
      password: "",
      confirm_password: ""
    }
    
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<"stepOne" | "stepTwo" | "stepThree">('stepOne')
    const [resetPasswordData, setResetPasswordData] = useState<ResetPasswordTypes>(InitialResetPasswordData)
    const [otp, setOtp] = useState<any>()
    const [formErrors, setFormErrors] = useState<any>()
    const [errorMessage, setErrorMessage] = useState<string>("empty")
    const [showPass, setShowPass] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setErrorMessage("empty")
      setResetPasswordData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }

    const handleContinue = async (e: any) => {
      e.preventDefault()
      // form validation
      const newFormErrors = formValidation(resetPasswordData, ["otp", "password", "confirm_password"])
      setFormErrors(newFormErrors)
      const errorLength = Object.keys(newFormErrors).length;
      if(errorLength > 0) return

      setLoading(true)

     // sent otp api call
      try {
      await sentOtp(resetPasswordData.email)
      setStep("stepTwo")
      setLoading(false)
      setErrorMessage("empty")
    } catch (error: any) {
       if(error?.response){
         setStep("stepTwo")
         setLoading(false)
         setErrorMessage("empty")
       }else{
        setErrorMessage("something went wrong")
        setLoading(false)
       }
    }

    }

    const handleSubmitOtp = async (e: any) => {
      e.preventDefault()
      if(otp < 4) return setErrorMessage("please enter 4 digit otp")

      setLoading(true)

      // submit otp api call
      try {
        await submitOtp(resetPasswordData.email, otp.toString())
        setStep("stepThree")
        setLoading(false)
        setErrorMessage("empty")
      } catch (error: any) {
         if(error?.response){
           setErrorMessage("Invalid Otp")
           setLoading(false)
         }else{
          setErrorMessage("something went wrong")
          setLoading(false)
         }
      }
    }

    const handleResetPassword = async () => {
      // form validation
      const newFormErrors = formValidation(resetPasswordData, ["email"])
      setFormErrors(newFormErrors)
      const errorLength = Object.keys(newFormErrors).length;
      if(errorLength > 0) return

      setLoading(true)

      // submit otp api call
      try {
        await forgotResetPassword(resetPasswordData.email, otp, resetPasswordData.password)
        setLoading(false)
        setErrorMessage("empty")
        router.push("/login")
        toast.success("Passwrod changed successfully")
      } catch (error: any) {
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
    <Div>
      { step === "stepOne" && 
       <Form onSubmit={handleContinue} >
        <InputField
         type="text"
         name="email"
         label="Enter your email address"
         placeHolder="mail@example.com"
         autoFocus
         containerStyle="mt-3"
         inputContainerStyle="mt-[2px]"
         className="w-full lowercase bg-gray-100"
         onChange={handleChange}
         invalid={!!formErrors?.email}
         errorMessage={formErrors?.email}
        /> 
       </Form>
      }
      { step === "stepTwo" && (
        <Form onSubmit={handleSubmitOtp} >
          <Otp email={`${resetPasswordData.email}, if you registered`} otp={otp} onChange={setOtp} />
        </Form>
      )}
      { step === "stepThree" && 
      <>
       <InputField
        type={`${showPass ? "text" : "password"}`}
         name="password"
         label="Create new password"
         placeHolder="Enter password"
         autoFocus
         containerStyle="mt-3"
         inputContainerStyle="mt-[2px]"
         className="w-full lowercase bg-gray-100"
         onChange={handleChange}
         invalid={!!formErrors?.password}
         errorMessage={formErrors?.password}
       /> 
       <InputField
         type={`${showPass ? "text" : "password"}`}
         name="confirm_password"
         label="Confirm password"
         placeHolder="Re enter password"
         containerStyle="mt-3"
         inputContainerStyle="mt-[2px]"
         className="w-full lowercase bg-gray-100"
         onChange={handleChange}
         invalid={!!formErrors?.confirm_password}
         errorMessage={formErrors?.confirm_password}
       /> 
      <Div className="flex justify-end w-full" >
       <PlainButton className="text-[12px] cursor-pointer hover:underline" onClick={()=> setShowPass((prevState)=> !prevState)} >Show Password</PlainButton>
      </Div>
      </>
      }

      <Div className='w-full flex flex-col gap-1 mt-9' >
        { step === "stepOne" && <Button disabled={loading} onClick={handleContinue} >
          {loading ? <LoadingIcon className="animate-spin" /> : "Continue" }
        </Button>
        }
        { step === "stepTwo" && <Button disabled={loading} onClick={handleSubmitOtp} >
          {loading ? <LoadingIcon className="animate-spin" /> : "Submit OTP" }
        </Button>
        }
        { step === "stepThree" && <Button disabled={loading} onClick={handleResetPassword} >
          {loading ? <LoadingIcon className="animate-spin" /> : "Reset Password" }
        </Button>
        }
       </Div>
       { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
      <Div className="flex flex-col mt-5 gap-3" >
      <Typography className="flex items-center justify-center gap-2 text-sm">
        Create new account?
        <Link href="/create-store" className="underline">
          Sign Up
        </Link>
      </Typography>
      </Div>

    </Div>
  );
}
