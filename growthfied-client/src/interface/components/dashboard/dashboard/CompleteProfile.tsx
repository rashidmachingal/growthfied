"use client"

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, InputField, Label, TextArea, Typography } from "@/interface/fragments";
import { AlertText, AuthProtection, Logo } from "@/interface/components";
import { CameraIcon, LoadingIcon, UserFillIcon } from "@/interface/icons";
import { CompleteProfileDataTypes } from "@/types/onboarding";
import { completeProfile } from "@/@api/dashboard/onboarding.api";
import { formValidation } from "@/utils/formValidation";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { toast } from "sonner";
import { revalidateServerAction } from "@/app/actions";
import { useWelcomeMessage } from "@/zustand/dashboard/welcomeMessage";
import Cookies from "universal-cookie";

export default function CompleteProfile() {

  const searchParams = useSearchParams()
  const router = useRouter()

  const { update_user, update_unauthorized } = useUserStore()
  const { update_welcome } = useWelcomeMessage()

  const InitialCompleteProfileData = {
    store_name: "",
    profile_picture: "",
    temporary_profile_url: null,
    whatsapp_number: 0,
    bio: ""
};

  const [completeProfileData, setCompleteProfileData] = useState<CompleteProfileDataTypes>(InitialCompleteProfileData)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [formErrors, setFormErrors] = useState<any>()
  const [queryWhatsappNumber, setQueryWhatsappNumber] = useState<number | undefined>(undefined)

    // set query whatsapp number
    useEffect(() => {
     const query = searchParams.get("n")
     if(query !== null){
      setQueryWhatsappNumber(Number(query))
      setCompleteProfileData((prevData) => ({
        ...prevData,
        whatsapp_number: Number(query)
      }))
     }
    }, [searchParams])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    if(e.target.name === "profile_picture"){
      const profile_picture = e.target.files ? e.target.files[0] : null;
      if(profile_picture){
        setCompleteProfileData((prevData) => ({
          ...prevData,
          profile_picture: profile_picture,
        }));
        
        setCompleteProfileData((prevData) => ({
          ...prevData,
          temporary_profile_url: (URL.createObjectURL(profile_picture)),
        }));
      }
    }else{
      setCompleteProfileData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
      console.log(completeProfileData,"@completeProfileData")
    }
  }

  const handleCompleteProfile = async () => {
    // form validation
    const newFormErrors = formValidation(completeProfileData, ["bio", "profile_picture", "temporary_profile_url"])
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return

    setLoading(true)

    // onboarding api call
    try {
      const res = await completeProfile(completeProfileData)
      update_user(res.data.username, res.data.profile_picture, res.data.on_boarding)
      router.push("/dashboard")
      toast.success("Profile created successfully")
      revalidateServerAction("store")
      update_welcome(true)
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
      }
      setLoading(false)
      setErrorMessage("something went wrong")
    }
  }

  const handleRemove = () => {
    setCompleteProfileData((prevData) => ({
      ...prevData,
      "temporary_profile_url": null,
      "profile_picture" : ""
    }));
  }

  return (
    <>
      <AuthProtection/>
      <Div className="w-[100vw] bg-[#f1f1f1] h-[100vh] flex flex-col gap-3 items-center md:justify-center fixed left-0 z-[100] top-0" >
        <Logo color="black" className="mix-blend-multiply mt-[2rem] md:mt-0" />
      <Div className="w-[95vw] lg:w-[40vw] shadow  bg-white rounded-theme p-5 pt-4 mt-[3rem] md:mt-[2rem]">
        <Div className="flex items-center justify-between border-b pb-2">
          <Typography className="font-medium">Complete Your store</Typography>
        </Div>
        <Div className="flex flex-col pl-1 pb-2 mt-2 gap-[8px] w-full overflow-auto style-scroll pr-3">
        <Div>
          <Div className="flex flex-col items-center justify-center" >
            {completeProfileData.temporary_profile_url === null ? 
             <UserFillIcon className="!w-[10rem] h-[10rem] fill-[#c8c8c8]" /> :
             <Image 
               src={completeProfileData.temporary_profile_url} 
               className="w-[10rem] h-[10rem] rounded-full object-center object-cover" alt="img" 
               height={0} 
               width={0}
            />
            }
            { completeProfileData.temporary_profile_url !== null && <Div onClick={handleRemove} className="text-[12px] hover:underline cursor-pointer text-yellow-600" >Remove</Div>}
            <Label htmlFor="profile_picture" className="mt-[15px] font-medium flex items-center gap-2 text-[13px] border hover:border-black h-theme px-[1.5rem] rounded-[50px]" >
              <CameraIcon className="stroke-[#333]" />
              {completeProfileData.temporary_profile_url === null ? "Upload Logo" : "Change Logo" }
            </Label>
            <InputField onChange={handleChange} name="profile_picture" id="profile_picture" type="file" accept="image/*" className="hidden" />
          </Div>
         </Div>
         <InputField
          type="text"
          name="store_name"
          label="Store Name"
          placeHolder="Store Name"
          containerStyle="mt-2"
          inputContainerStyle="mt-[2px]"
          className="w-full bg-gray-100"
          onChange={handleChange}
          invalid={!!formErrors?.store_name}
          errorMessage={formErrors?.store_name}
       />
        <TextArea
          label="Enter your store short caption/description (optional)"
          name="bio"
          placeHolder="Eg: Best quality t-shirts in Kerala"
          className="w-full text-[14px] mt-[2px] bg-gray-100 !h-[3.5rem]"
          containerStyle=""
          onChange={handleChange}
         />
         <InputField
          type="number"
          name="whatsapp_number"
          innerText="+91"
          label="Enter your whatsapp number"
          placeHolder="Whatsapp number"
          containerStyle="mt-2"
          inputContainerStyle="mt-[2px]"
          innerTextStyle="pl-3 border-r pr-2 mt-[2px]"
          className="pl-[3.5rem] w-full bg-gray-100"
          onChange={handleChange}
          invalid={!!formErrors?.whatsapp_number}
          errorMessage={formErrors?.whatsapp_number}
          defaultValue={queryWhatsappNumber}
       />
        </Div>
        <Div className="mt-[15px] w-full gap-3">
         <Button className="w-full" disabled={loading} onClick={handleCompleteProfile} >
          {loading ? <LoadingIcon className="animate-spin" /> : "Complete Profile"}
         </Button>
        </Div>
        { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
      </Div>
      </Div>
    </>
  );
}
