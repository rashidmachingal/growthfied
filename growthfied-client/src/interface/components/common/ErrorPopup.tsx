"use client"

import { Button, Div, Typography } from "@/interface/fragments";
import { Popup } from "@/interface/components";

type ErrorPopupTypes = {
  open: boolean
  onClose:  () => void
  server_title?: string
  client_title?: string
  formErrors: any
  type: "client" | "server"
  custom_error?: boolean
  custom_error_message?: string 
}

export default function ErrorPopup({ open, onClose, formErrors = {}, type, server_title, client_title, custom_error = false, custom_error_message }: ErrorPopupTypes) {

  return (
    <Popup open={open} onClose={onClose}>
      <Div className="w-[95vw] lg:w-[35vw] shadow bg-white rounded-theme p-5 pt-4">

        {type === "server" && custom_error === false && (
           <Div className="flex flex-col pl-1 pb-2 gap-[8px] w-full overflow-auto style-scroll pr-3 mt-[8px]">
            <Typography className="font-medium text-red-600" >Something went wrong, {server_title} failed please try again</Typography>
          </Div>
        )}

        {type === "server" && custom_error === true && (
           <Div className="flex flex-col pl-1 pb-2 gap-[8px] w-full overflow-auto style-scroll pr-3 mt-[8px]">
            <Typography className="font-medium text-red-600" >{custom_error_message}</Typography>
          </Div>
        )}

        {type === "client" && (
          <>
          <Div className="flex flex-col pl-1 pb-2 gap-[8px] w-full overflow-auto style-scroll pr-3 mt-[8px]">
            <Typography className="font-medium text-red-600" >There is {Object.keys(formErrors).length} error with this {client_title}</Typography>
        </Div>
        <Div className="flex flex-col gap-[3px]" >
        {Object.keys(formErrors)?.map((key) => (
            <Typography key={key} className="text-[13px] text-red-500">{formErrors[key]}</Typography>
          ))}

        </Div>
          </>
        )}

        <Div className="mt-[30px] flex justify-end gap-3">
          <Button onClick={onClose} className="!h-[2rem] w-[5rem] border-black !bg-gray-200 hover:!bg-gray-300 !text-black">
            Close
          </Button>
          <Button onClick={onClose} className="!h-[2rem] !w-[6rem]">
           Okay
          </Button>
        </Div>

      </Div>
    </Popup>
  );
}
