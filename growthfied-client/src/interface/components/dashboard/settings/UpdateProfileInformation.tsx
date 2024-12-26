"use client"

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, InputField, Label, TextArea, Typography } from "@/interface/fragments";
import { CameraIcon, LoadingIcon, UserFillIcon } from "@/interface/icons";
import { UpdateProfileInfoDataTypes } from "@/types/dashboard/settings";
import { AlertText } from "@/interface/components";
import { getProfileInfo, updateProfileInfo } from "@/@api/dashboard/settings.api";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { formValidation } from "@/utils/formValidation";
import { BACKEND_URL } from "../../../../../config";
import { toast } from "sonner";
import { revalidateServerAction } from "@/app/actions";
import Cookies from "universal-cookie";

export default function UpdateProfileInformation() {

  const { profile_picture, username,  update_user } = useUserStore()
  const { update_unauthorized } = useUserStore()

  // fetch default profile info
  useEffect( ()  => {
    const fetchData = async () => {
      try {
        const res = await getProfileInfo()
        setDefaultProfileInfo(res.data)
        setUpdateProfileInfoData((prevData) => ({
          ...prevData,
          profile_picture: profile_picture,
          prev_profile: profile_picture,
          bio: res.data.bio,
          email: res.data.email,
          mobile_number: res.data.mobile_number,
          whatsapp_number: res.data.whatsapp_number
        }))
        setDefaultProfileInfoLoading(false)
      } catch (error: any) {
        if (error.response.status === 401) {
          const cookies = new Cookies();
          cookies.remove("token", { path: "/" });
          update_unauthorized()
        }
        setDefaultProfileInfoLoading(false)
        setErrorMessage("failed to load your profile info")
      }
    }

    fetchData()
  }, [profile_picture, update_unauthorized])
  
  const InitialDefaultProfileInfo = {
    store_name: "",
    bio: "",
    mobile_number: 0,
    whatsapp_number: 0
  }

  const InitialUpdateProfileInfoData = {
    store_name: "",
    profile_picture: "",
    temporary_profile_url: `${BACKEND_URL}/public/images/profiles/${profile_picture}`,
    is_no_profile: profile_picture,
    prev_profile: profile_picture,
    bio: "",
    mobile_number: 0,
    whatsapp_number: 0,
  }

  const [defaultProfileInfo, setDefaultProfileInfo] = useState(InitialDefaultProfileInfo)
  const [defaultProfileInfoLoading, setDefaultProfileInfoLoading] = useState(true)
  const [updateProfileInfoData, setUpdateProfileInfoData] = useState<UpdateProfileInfoDataTypes>(InitialUpdateProfileInfoData)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [formErrors, setFormErrors] = useState<any>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    if(e.target.name === "profile_picture"){
      const profile_picture_file = e.target.files ? e.target.files[0] : null;
      if(profile_picture_file){
        setUpdateProfileInfoData((prevData) => ({
          ...prevData,
          profile_picture: profile_picture_file,
        }));
        
        setUpdateProfileInfoData((prevData) => ({
          ...prevData,
          temporary_profile_url: (URL.createObjectURL(profile_picture_file)),
          is_no_profile: "profile_added",
        }));
      }
    }else{
      setUpdateProfileInfoData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  }

  const handleUpdate = async () => {
    if(defaultProfileInfoLoading) return
    // form validation
    const newFormErrors = formValidation(updateProfileInfoData, ["profile_picture", "temporary_profile_url", "is_no_profile"])
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return
    
    setLoading(true)

    // update profile info api call
    try {
      const res = await updateProfileInfo(updateProfileInfoData)
      setErrorMessage("empty")
      setLoading(false)
      update_user(username, res.data.profile_picture, true)
      toast.success("Updated successfully")
      revalidateServerAction("store")
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

  const handleImageRemove = () => {
    setUpdateProfileInfoData((prevData) => ({
      ...prevData,
      "temporary_profile_url": null,
      "profile_picture" : "no_profile"
    }));
  }


  return (
    <Div className="w-full xl:w-[55%] rounded-theme bg-white p-3 pt-2 pb-[2rem]">
      <Typography className="font-medium text-[14px]">Store Information</Typography>
      <Div className="mt-[8px] flex flex-col gap-[4px]">
      <Div>
          <Div className="flex flex-col items-center justify-center" >
            {updateProfileInfoData.temporary_profile_url === null || updateProfileInfoData.is_no_profile === "no_profile" ? 
             <UserFillIcon className="!w-[10rem] h-[10rem] fill-[#c8c8c8]" /> :
             <Image 
               width={350}
               height={350}
               src={updateProfileInfoData.temporary_profile_url} 
               className="w-[10rem] h-[10rem] rounded-full object-center object-cover shadow-lg" 
               alt="img"
             />
            }

              {updateProfileInfoData.temporary_profile_url !== null && <Div onClick={handleImageRemove} className="text-[12px] hover:underline cursor-pointer text-yellow-600" >Remove</Div>}
            
            <Label htmlFor="profile_picture" className="mt-[15px] font-medium flex items-center gap-2 text-[13px] border hover:border-black h-theme px-[1.5rem] rounded-[50px]" >
              <CameraIcon className="stroke-[#333]" />
              {updateProfileInfoData.temporary_profile_url === null ? "Upload Logo" : "Change Logo" }
            </Label>
            <InputField onChange={handleChange} name="profile_picture" id="profile_picture" type="file" accept="image/*" className="hidden" />
          </Div>
         </Div>

        { defaultProfileInfoLoading === true && <Div className="flex flex-col gap-[10px]" >
        <Div className="flex flex-col gap-[3px]" >
          <Typography className="text-[13px]" >Store Name</Typography>
          <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
        </Div>
        <Div className="flex flex-col gap-[3px]" >
          <Typography className="text-[13px]" >Enter your store short caption</Typography>
          <Div className="w-full h-[3.5rem] rounded-[3px] placeholder-animation"></Div>
        </Div>
        <Div className="flex flex-col gap-[3px]" >
          <Typography className="text-[13px]" >Phone Number</Typography>
          <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
        </Div>
        <Div className="flex flex-col gap-[3px]" >
          <Typography className="text-[13px]" >Whatsapp Number</Typography>
          <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
        </Div>
        </Div>}

        { defaultProfileInfoLoading === false && <>
          <InputField
          label="Store Name"
          name="store_name"
          type="text"
          placeHolder="Enter Store Name"
          containerStyle="w-full mt-2"
          className="!w-full bg-gray-100 mt-[2px] text-[14px]"
          defaultValue={defaultProfileInfo.store_name}
          onChange={handleChange}
          invalid={!!formErrors?.store_name}
          errorMessage={formErrors?.store_name}
        />
        <TextArea
          label="Enter your store short caption"
          name="bio"
          placeHolder="Eg: Best quality t-shirts in Kerala"
          className="w-full text-[14px] mt-[2px] bg-gray-100 !h-[3.2rem]"
          containerStyle="mt-[8px] mt-[8px]"
          defaultValue={defaultProfileInfo.bio}
          onChange={handleChange}
          invalid={!!formErrors?.bio}
          errorMessage={formErrors?.bio}
        />

        <InputField
          label="Phone Number"
          name="mobile_number"
          type="number"
          placeHolder="Phone Number"
          innerText="+91"
          innerTextStyle="left-3 mt-[3px] border-r pr-[5px]"
          containerStyle="w-full mt-2"
          className="!w-full bg-gray-100 mt-[2px] pl-[51px]"
          defaultValue={defaultProfileInfo.mobile_number}
          onChange={handleChange}
          invalid={!!formErrors?.mobile_number}
          errorMessage={formErrors?.mobile_number}
        />
        <InputField
          label="Whatsapp Number"
          name="whatsapp_number"
          type="number"
          placeHolder="Whatsapp Number"
          innerText="+91"
          innerTextStyle="left-3 mt-[3px] border-r pr-[5px]"
          containerStyle="w-full mt-2"
          className="!w-full bg-gray-100 mt-[2px] pl-[51px]"
          defaultValue={defaultProfileInfo.whatsapp_number}
          onChange={handleChange}
          invalid={!!formErrors?.whatsapp_number}
          errorMessage={formErrors?.whatsapp_number}
        />
        </>}
        <Button disabled={loading}  onClick={handleUpdate} className="mt-8">
        {loading ? <LoadingIcon className="animate-spin" /> : "Update"}
        </Button>
      </Div>
      { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
    </Div>
  );
}
