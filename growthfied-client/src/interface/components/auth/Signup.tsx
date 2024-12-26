"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, InputField, PlainButton } from "@/interface/fragments";
import { AlertText } from "@/interface/components";
import { checkUsername, userSignup } from "@/@api/auth/auth.api";
import { SignupDataTypes } from "@/types/auth";
import { LoadingIcon } from "@/interface/icons";
import { formValidation } from "@/utils/formValidation";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import Cookies from "universal-cookie";
import { toast } from "sonner";
import { DOMAIN_NAME } from "../../../../config";

export default function Signup() {

    const searchParams = useSearchParams()
    const router = useRouter()
    const cookies = new Cookies();
    const { update_user } = useUserStore()

    const InitialSignupData = {
      username: "",
      mobile_number: 0,
      email: "",
      password: "",
    }
    
    const [queryUsername, setQueryUsername] = useState<string | undefined>(undefined)
    const [signupData, setSignupData] = useState<SignupDataTypes>(InitialSignupData)
    const [step, setStep] = useState<"stepOne" | "stepTwo">('stepOne')
    const [loading, setLoading] = useState(false)
    const [userNameReady, setUserNameReady] = useState< boolean | undefined >(undefined)
    const [errorMessage, setErrorMessage] = useState<string>("empty")
    const [formErrors, setFormErrors] = useState<any>()
    const [showPass, setShowPass] = useState(false)

    // check user when there is query params
    useEffect(() => {
      const username = searchParams.get('n');
      if(username !== null){
        setLoading(true)
        console.log(username)
        setQueryUsername(username)
        setSignupData((prevData) => ({
          ...prevData,
          username: username
        }));
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (queryUsername !== undefined) {
        handleCheckUsername();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryUsername]);
    
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setErrorMessage("empty")
      if (formErrors !== undefined) {
        const { [e.target.name]: _, ...rest } = formErrors;
        setFormErrors(rest);
      }
      if(e.target.name === "username"){
        setSignupData((prevData) => ({
          ...prevData,
          [e.target.name]: e.target.value.toLowerCase(),
        }));
      }else{
        setSignupData((prevData) => ({
          ...prevData,
          [e.target.name]: e.target.value,
        }));
      }
    }

    const handleCheckUsername = async (e?: any) => {
      if(e) e.preventDefault()

      setLoading(true)

      console.log(queryUsername,"@")

      // username validation
      const newFormErrors = formValidation(signupData)
      if(newFormErrors.hasOwnProperty("username")){
        setFormErrors({username: newFormErrors?.username})
        setLoading(false)
        return
      }
      const updatedFormErrors = { ...formErrors };
      delete updatedFormErrors.username;
      setFormErrors(updatedFormErrors);

      // check username api call
      try {
        await checkUsername(signupData.username)
        setUserNameReady(true)
        setErrorMessage("empty")
        setLoading(false)
        setStep("stepTwo")
        return "ok"
      } catch (error: any) {
        if(error?.response){
          setUserNameReady(false)
          setErrorMessage(error?.response?.data?.message)
          setLoading(false)
          return "failed"
        }else{
          setErrorMessage("something went wrong")
          setLoading(false)
         return ("failed")
        }
      }
    }

    const handleSignup = async () => {
      // check again username already taken
      const status = await handleCheckUsername()

      if(status === "ok") {
      // form validation
      const newFormErrors = formValidation(signupData)
      setFormErrors(newFormErrors)
      const errorLength = Object.keys(newFormErrors).length;
      if(errorLength > 0) return

      setLoading(true)

      // signup api call
      try {
         const res = await userSignup(signupData)
         cookies.set("token", res.data.token, { path: "/", maxAge: 15552000 })
         update_user("", "", false)
         router.push(`/dashboard?n=${signupData.mobile_number}`)
         toast.success("Account created successfully")
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
    }

  return (
    <Div>
      <InputField
        type="text"
        name="username"
        label="Choose a subdomain for your store"
        placeHolder="subdomain"
        innerText={`.${DOMAIN_NAME}`}
        innerTextStyle={`${userNameReady ? "right-[35px]": "right-[11px]"} text-[15px] top-[7px] z-[50]`}
        autoFocus={queryUsername !== undefined}
        containerStyle="mt-2"
        inputContainerStyle="mt-[2px]"
        className="w-full lowercase bg-gray-100 pr-[9.5rem]"
        onChange={handleChange}
        showTick={userNameReady}
        invalid={!!formErrors?.username}
        errorMessage={`Please enter subdomain*`}
        defaultValue={queryUsername}
      />

      { step === "stepTwo" && 
      <>
       <InputField
         type="number"
         name="mobile_number"
         innerText="+91"
         label="Enter your mobile number"
         placeHolder="Mobile number"
         autoFocus
         containerStyle="mt-2"
         inputContainerStyle="mt-[2px]"
         innerTextStyle="left-3 border-r pr-2"
         className="pl-[3.5rem] w-full bg-gray-100"
         onChange={handleChange}
         invalid={!!formErrors?.mobile_number}
         errorMessage={formErrors?.mobile_number}
       />
       <InputField 
         type="text" 
         name="email"
         label="Enter your email address"
         placeHolder="mail@example.com" 
         containerStyle="mt-3"
         inputContainerStyle="mt-[2px]"
         className="w-full lowercase bg-gray-100"
         onChange={handleChange}
         invalid={!!formErrors?.email}
         errorMessage={formErrors?.email}
       />
       <InputField 
         type={`${showPass ? "text" : "password"}`}
         name="password" 
         label="Create new password"
         placeHolder="Enter password" 
         containerStyle="mt-3"
         inputContainerStyle="mt-[2px]"
         className="w-full bg-gray-100"
         onChange={handleChange}
         invalid={!!formErrors?.password}
         errorMessage={formErrors?.password}
       />
      <Div className="flex justify-end w-full" >
       <PlainButton className="text-[12px] cursor-pointer hover:underline" onClick={()=> setShowPass((prevState)=> !prevState)} >Show Password</PlainButton>
      </Div>
       </>
      }

      { errorMessage !== "empty" &&
        <AlertText
         text={errorMessage} 
         variant="danger" 
         className="mt-4"
        />
      }
      
     <Div className='w-full flex flex-col gap-1 mt-9' >
       {step === "stepOne" && 
        <Button disabled={loading} onClick={handleCheckUsername} >
            {loading ? <LoadingIcon className="animate-spin" /> : "Continue"}
        </Button>
       }
       {step === "stepTwo" && 
        <Button disabled={loading} onClick={handleSignup} >
          {loading ? <LoadingIcon className="animate-spin" /> : "Create Store"}
        </Button>
       }
     </Div>
    </Div>
  )
}