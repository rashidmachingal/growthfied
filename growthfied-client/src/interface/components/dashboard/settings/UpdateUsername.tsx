"use client"

import { ChangeEvent, useState } from "react";
import { Button, Div, InputField, Typography } from "@/interface/fragments";
import { LoadingIcon } from "@/interface/icons";
import { AlertText } from "@/interface/components";
import { UpdateUsernameTypes } from "@/types/dashboard/settings";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { formValidation } from "@/utils/formValidation";
import { updateUsername } from "@/@api/dashboard/settings.api";
import { toast } from "sonner";
import { revalidateServerAction } from "@/app/actions";
import { makeUnauthorized } from "@/utils/cookie";
import Cookies from "universal-cookie";
import { DOMAIN_NAME } from "../../../../../config";

export default function UpdateUsername() {

    const { username, profile_picture, on_boarding, update_user } = useUserStore()
    const { update_unauthorized, loading } = useUserStore()

    const InitialUserNameData = { username: username }
    const [updateUsernameData, setUpdateUsernameData] = useState<UpdateUsernameTypes>(InitialUserNameData)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("empty")
    const [formErrors, setFormErrors] = useState<any>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    setUpdateUsernameData({username: e.target.value});
  }

  const handleUpdateUsername = async () => {
    setErrorMessage("empty")

    // form validation
    const newFormErrors = formValidation(updateUsernameData)
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return

    if(username === updateUsernameData.username) return

    setUpdateLoading(true)

    // update username api call
    try {
      await updateUsername(updateUsernameData)
      update_user(updateUsernameData.username, profile_picture, on_boarding)
      setUpdateLoading(false)
      toast.success("Username update successfully")
      revalidateServerAction("store")
    } catch (error: any) {
       if (error.response.status === 401) {
          const cookies = new Cookies();
          cookies.remove("token", { path: "/" });
          update_unauthorized()
       }
       if(error?.response){
         setErrorMessage(error?.response?.data?.message)
         setUpdateLoading(false)
       }else{
        setErrorMessage("something went wrong")
        setUpdateLoading(false)
       }
    }
  }

  return (
    <Div className="w-full xl:w-[55%] rounded-theme bg-white p-3 pt-2 pb-[1.8rem]">
      <Typography className="font-medium text-[14px]">Store Name</Typography>
    <Div className="flex flex-col mmd:flex-row justify-between w-full gap-3">
        { loading && 
        <Div className="flex flex-col gap-[3px] w-full mt-1" >
          <Typography className="text-[13px]" >Your store username</Typography>
          <Div className="w-full h-theme rounded-[3px] placeholder-animation"></Div>
        </Div>
        }
      { !loading && <InputField
        type="text"
        name="username"
        label="Your store username"
        placeHolder="storename"
        innerText={`.${DOMAIN_NAME}`}
        defaultValue={username}
        innerTextStyle="right-[11px] text-[15px] top-[10px]"
        containerStyle="mt-2 w-full"
        className="w-full mt-[2px] lowercase bg-gray-100"
        invalid={!!formErrors?.username}
        errorMessage={formErrors?.username}
        onChange={handleChange}
      />}
      <Button disabled={updateLoading} onClick={handleUpdateUsername} className="mmd:mt-[29px] text-[10px] w-full mmd:w-[10rem]">
        {updateLoading ? <LoadingIcon className="animate-spin" /> : "Update"}
      </Button>
    </Div>
    { errorMessage !== "empty" && <AlertText text={errorMessage} variant="danger" className="mt-4" />}
    </Div>
  );
}
