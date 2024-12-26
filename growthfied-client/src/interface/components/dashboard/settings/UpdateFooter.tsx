"use client"

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, InputField, Label, TextArea, Typography } from "@/interface/fragments";
import { CameraIcon, LoadingIcon, UserFillIcon } from "@/interface/icons";
import { UpdateProfileInfoDataTypes } from "@/types/dashboard/settings";
import { AlertText } from "@/interface/components";
import { getFooterInfo, updateFooterInfo, updateProfileInfo } from "@/@api/dashboard/settings.api";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { formValidation } from "@/utils/formValidation";
import { BACKEND_URL } from "../../../../../config";
import { toast } from "sonner";
import { revalidateServerAction } from "@/app/actions";
import Cookies from "universal-cookie";

export default function UpdateFooter() {

  const { profile_picture, username,  update_user } = useUserStore()
  const { update_unauthorized } = useUserStore()

  // fetch default profile info
  useEffect( ()  => {
    const fetchData = async () => {
      try {
        const res = await getFooterInfo()
        setDefaultFooterInfo((prevData) => ({
            ...prevData,
            footer: res.data.footer
        }))
        setUpdateFooterInfoData((prevData) => ({
          ...prevData,
          footer: res.data.footer
        }))
        setDefaultFooterInfoLoading(false)
      } catch (error: any) {
        if (error.response.status === 401) {
          const cookies = new Cookies();
          cookies.remove("token", { path: "/" });
          update_unauthorized()
        }
        setDefaultFooterInfoLoading(false)
        setErrorMessage("failed to load your profile info")
      }
    }

    fetchData()
  }, [profile_picture, update_unauthorized])
  
  const InitialDefaultFooterInfo = {
    footer: ""
  }

  const InitialUpdateFooterInfoData = {
    footer: ""
  }

  const [defaultProfileInfo, setDefaultFooterInfo] = useState(InitialDefaultFooterInfo)
  const [defaultFooterInfoLoading, setDefaultFooterInfoLoading] = useState(true)
  const [updateFooterInfoData, setUpdateFooterInfoData] = useState(InitialUpdateFooterInfoData)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [formErrors, setFormErrors] = useState<any>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    setFormErrors(null)
    setUpdateFooterInfoData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
    }));
  }

  const handleUpdate = async () => {
    if(defaultFooterInfoLoading) return
    // form validation
    const newFormErrors = formValidation(updateFooterInfoData)
    setFormErrors(newFormErrors)
    console.log(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return
    
    setLoading(true)

    // update footer info api call
    try {
      await updateFooterInfo(updateFooterInfoData)
      setErrorMessage("empty")
      setLoading(false)
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

  return (
    <Div className="w-full xl:w-[55%] rounded-theme bg-white p-3 pt-2 pb-[2rem]">
      <Typography className="font-medium text-[14px]">Footer Section</Typography>
      <Div className="mt-[3px] flex flex-col gap-[4px]">

        { defaultFooterInfoLoading === true && <Div className="flex flex-col gap-[10px]" >
        <Div className="flex flex-col gap-[3px]" >
          <Typography className="text-[13px]" >Footer</Typography>
          <Div className="w-full h-[3.5rem] rounded-[3px] placeholder-animation"></Div>
        </Div>
        </Div>}

        { defaultFooterInfoLoading === false && <>
         <TextArea
          label="Enter Footer Section"
          name="footer"
          placeHolder="Acme Corp - Address"
          className="w-full text-[14px] mt-[2px] bg-gray-100 !min-h-[3.2rem] resize-y	"
          containerStyle="mt-[8px] mt-[8px]"
          defaultValue={defaultProfileInfo.footer}
          onChange={handleChange}
          invalid={!!formErrors?.footer}
          errorMessage={formErrors?.footer}
        />

        </>}
        <Button disabled={loading}  onClick={handleUpdate} className="mt-[5px]">
        {loading ? <LoadingIcon className="animate-spin" /> : "Update"}
        </Button>
      </Div>
      { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
    </Div>
  );
}
