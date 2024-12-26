"use client"

import { Button, Div, Typography } from "@/interface/fragments";
import { Popup } from "@/interface/components";
import { LoadingIcon } from "@/interface/icons";

type ConfirmPopupProps = {
  open: boolean
  title: string
  content: string
  buttonText: string
  loading: boolean
  onClose:  () => void
  onSubmit: () => void
  isCancel?: boolean
}

export default function ConfirmPopup({ open, onClose, loading, title, content, onSubmit, buttonText, isCancel = false }: ConfirmPopupProps) {

  return (
    <Popup open={open} onClose={onClose} >
      <Div className="w-[95vw] lg:w-[35vw] shadow  bg-white rounded-theme p-5 pt-4">
        <Div className="flex items-center justify-between border-b pb-2">
          <Typography className="font-medium">{title}</Typography>
        </Div>
        <Div className="flex flex-col pl-1 pb-2 gap-[8px] w-full overflow-auto style-scroll pr-3 mt-[8px]">
            <Typography>{content}</Typography>
        </Div>
        <Div className="mt-[30px] flex justify-end gap-3">
          { isCancel && (
            <Button onClick={onClose} className="!h-[2rem] w-[5rem] border-black !bg-gray-200 hover:!bg-gray-300 !text-black">
             Close
            </Button>
          )}
          <Button onClick={onSubmit} disabled={loading} className="!h-[2rem] !w-[8rem] !bg-red-600">
           {loading ? <LoadingIcon className="animate-spin" /> : buttonText}
          </Button>
        </Div>

      </Div>
    </Popup>
  );
}
