"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Button, Div, Form, InputField, PlainButton, Span, Typography } from "@/interface/fragments";
import { LoadingIcon } from "@/interface/icons";
import { AlertText } from "@/interface/components";
import { LoginDataTypes } from "@/types/auth";
import { formValidation } from "@/utils/formValidation";
import { userLogin } from "@/@api/auth/auth.api";
import { setAuthorization } from "@/@api/axios";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { toast } from "sonner";
import Cookies from "universal-cookie";

export default function Login() {

  const router = useRouter()
  const { update_user } = useUserStore()

  const InitialLoginData = { email: "", password: ""}
  
  const [loginData, setLoginData] = useState<LoginDataTypes>(InitialLoginData)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [formErrors, setFormErrors] = useState<any>()
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    if (formErrors !== undefined) {
      const { [e.target.name]: _, ...rest } = formErrors;
      setFormErrors(rest);
    }
    setLoginData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }

  const handleLogin = async (e: any) => {
    e.preventDefault()

    // form validation
    const newFormErrors = formValidation(loginData)
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return

    setLoading(true)

    // login api call
    try {
      const res = await userLogin(loginData)
      const cookies = new Cookies();
      cookies.set("token", res.data.token, { path: "/", maxAge: 15552000 })
      setAuthorization(res.data.token)
      update_user(res.data.username, res.data.profile_picture, res.data.on_boarding)
      toast.success("Logined to your account successfully",{ position:"bottom-right" })
      router.push("/dashboard")
    } catch (error: any) {
       if(error?.response){
         setErrorMessage(error?.response?.data?.message)
         console.log(error)
         setLoading(false)
       }else{
        setErrorMessage("something went wrong")
        console.log("@error_at")
        console.log(error)
        setLoading(false)
       }
    }
    
  }

  return (
    <Form onSubmit={handleLogin} >
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
      <InputField
        type={`${showPass ? "text" : "password"}`}
        name="password"
        label="Enter your password"
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
      <Div className="w-full flex flex-col gap-1 mt-9">
        <Button disabled={loading} onClick={handleLogin} >
          {loading ? <LoadingIcon className="animate-spin" /> : "Login"}
        </Button>
      </Div>
      { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
    </Form>
  );
}
