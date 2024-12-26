"use client"

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, InputField, Label, PlainButton, Span, Typography } from "@/interface/fragments";
import { CameraIcon, CloseButtonIcon, ExclamationIcon, LoadingIcon } from "@/interface/icons";
import { UpdateSeoInfoDataTypes } from "@/types/dashboard/settings";
import { AlertText } from "@/interface/components";
import { getStoreDetails, updateSeoInfo } from "@/@api/dashboard/settings.api";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { formValidation } from "@/utils/formValidation";
import { toast } from "sonner";
import { revalidateServerAction } from "@/app/actions";
import { BACKEND_URL } from "../../../../../config";
import imageCompression from 'browser-image-compression';
import Cookies from "universal-cookie";

export default function UpdateSeoInfo() {

  const { update_unauthorized, username } = useUserStore()

  // fetch default seo info
  useEffect( ()  => {
    const fetchData = async () => {
      try {
        const res = await getStoreDetails()
        setDefaultProfileInfo(res.data)
        setUpdateSeoInfoData((prevData) => ({
          ...prevData,
          meta_title: res.data.meta_title,
          meta_description: res.data.meta_description,
          favicon: res.data.favicon,
          prev_favicon: res.data.favicon,
          temporary_favicon_url: `${res.data.favicon === "no-favicon" ? `no-favicon` : `${BACKEND_URL}/public/images/favicons/${res.data.favicon}`}`
        }))

        SetDefaultSeoInfoLoading(false)
      } catch (error: any) {
        if (error.response.status === 401) {
          const cookies = new Cookies();
          cookies.remove("token", { path: "/" });
          update_unauthorized()
        }
        SetDefaultSeoInfoLoading(false)
        setErrorMessage("failed to load your seo info")
      }
    }

    fetchData()
  }, [update_unauthorized])
  
  const InitialDefaultSeoInfo = {
    meta_title: "string",
    meta_description: "string",
    favicon: "",
  }

  const InitialUpdateSeoInfoData = {
    meta_title: "",
    meta_description: "",
    favicon: "no-favicon",
    temporary_favicon_url: "",
    prev_favicon: ""
  }

  const [defaultProfileInfo, setDefaultProfileInfo] = useState(InitialDefaultSeoInfo)
  const [deafultSeoInfoLading, SetDefaultSeoInfoLoading] = useState(true)
  const [updateSeoInfoData, setUpdateSeoInfoData] = useState<UpdateSeoInfoDataTypes>(InitialUpdateSeoInfoData)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [formErrors, setFormErrors] = useState<any>()
  const [loadingState, setLoadingState] = useState(false)

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    if(e.target.name === "favicon"){
      const favicon_file = e.target.files ? e.target.files[0] : null;
      if(favicon_file){

        if (favicon_file.size > 2 * 1024 * 1024) {
          setLoadingState(true)
          return toast.error("Favicon Size: Keep it under 2MB",
            { icon: <ExclamationIcon className="!fill-yellow-500" />, position: "bottom-right" })
        }

        // Options for compression
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: undefined,
          useWebWorker: true,
          initialQuality: 1.0,
          alwaysKeepResolution: true,
        };

        try {
          let compressedBlob = await imageCompression(favicon_file, options);
          const compressedFile = new File([compressedBlob], favicon_file.name, {
            type: compressedBlob.type,
          });

          setUpdateSeoInfoData((prevData) => ({
            ...prevData,
            favicon: compressedFile,
            temporary_favicon_url: (URL.createObjectURL(favicon_file)),
          }))

          setLoadingState(false)
        } catch (error) {

          setUpdateSeoInfoData((prevData) => ({
            ...prevData,
            favicon: favicon_file,
            temporary_favicon_url: (URL.createObjectURL(favicon_file)),
          }))

        }
        
      }
    }else{
      setUpdateSeoInfoData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  }

  const handleUpdate = async () => {
    if(deafultSeoInfoLading) return
    // form validation
    const newFormErrors = formValidation(updateSeoInfoData, ["favicon", "temporary_favicon_url"])
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return
    
    setLoading(true)

    // update seo info api call
    try {
      const res = await updateSeoInfo(updateSeoInfoData)
      setErrorMessage("empty")
      setLoading(false)
      toast.success("Updated successfully")
      revalidateServerAction("store")
      setUpdateSeoInfoData((prevData) => ({
        ...prevData,
        prev_favicon: res.data.favicon
      }))
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
    setUpdateSeoInfoData((prevData) => ({
      ...prevData,
      "temporary_favicon_url": "no-favicon",
      "favicon" : "no-favicon"
    }));
  }


  return (
    <Div className="w-full xl:w-[55%] rounded-theme bg-white p-3 pt-2 pb-[2rem]">
      <Typography className="font-medium text-[14px]">SEO Settings</Typography>
      <Div className="mt-[8px] flex flex-col gap-[4px]">
        
        { deafultSeoInfoLading === true && <Div className="flex flex-col gap-[10px]" >
        <Div className="flex flex-col gap-[3px]" >
          <Typography className="text-[13px]" >Meta Title</Typography>
          <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
        </Div>
        <Div className="flex flex-col gap-[3px]" >
          <Typography className="text-[13px]" >Meta Description</Typography>
          <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
        </Div>
        <Div className="flex flex-col gap-[3px]" >
          <Typography className="text-[13px]" >Favicon (32x32px)</Typography>
          <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
        </Div>
        </Div>}

        { deafultSeoInfoLading === false && <>

        <InputField
          label="Meta Title"
          name="meta_title"
          type="text"
          placeHolder="Meta Title"
          containerStyle="w-full mt-2"
          className="!w-full bg-gray-100 mt-[2px]"
          defaultValue={defaultProfileInfo.meta_title}
          onChange={handleChange}
          invalid={!!formErrors?.meta_title}
          errorMessage={formErrors?.meta_title}
        />

        <InputField
          label="Meta Description"
          name="meta_description"
          type="text"
          placeHolder="Meta Description"
          containerStyle="w-full mt-2"
          className="!w-full bg-gray-100 mt-[2px]"
          defaultValue={defaultProfileInfo.meta_description}
          onChange={handleChange}
          invalid={!!formErrors?.meta_description}
          errorMessage={formErrors?.meta_description}
        />
        
        </>}

        <Div className="mt-1" >
          <Label className="text-[13px] ml-1" >Favicon (32x32px)</Label>
          <Div className="flex flex-col items-center" >
         
          { updateSeoInfoData.temporary_favicon_url === "no-favicon" ? (
            <Image 
            src="/favicon.ico" 
            width={20} 
            height={20} 
            alt="favicon" 
           />
          ) : 
           (
            <Image 
             src={`${updateSeoInfoData.temporary_favicon_url}`} 
             width={20} 
             height={20} 
             alt="favicon" 
            />
           )
          }

          { updateSeoInfoData.temporary_favicon_url !== "no-favicon" &&(
             <PlainButton 
              onClick={handleImageRemove} 
              className="text-[12px] text-yellow-500 mt-1 cursor-pointer" >
              Remove
            </PlainButton>
          )}

          <>
          <Label htmlFor="favicon" className="mt-[15px] font-medium flex items-center gap-2 text-[13px] border hover:border-black h-theme px-[1.5rem] rounded-[50px]" >
            <CameraIcon className="stroke-[#333]" />
              {loadingState ? "Loading..." : "Upload Favicon"}
            </Label>
          <InputField onChange={handleChange} name="favicon" id="favicon" type="file" accept="image/*" className="hidden" />
          </>
          </Div>
        </Div>

        <Button disabled={loading}  onClick={handleUpdate} className="mt-8">
        {loading ? <LoadingIcon className="animate-spin" /> : "Update"}
        </Button>
      </Div>
      { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
    </Div>
  );
}
