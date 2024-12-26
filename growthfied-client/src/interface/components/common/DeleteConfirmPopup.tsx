"use client"

import { Button, Div, Typography } from "@/interface/fragments";
import { Popup } from "@/interface/components";
import { LoadingIcon } from "@/interface/icons";


type DeleteConfirmPopupProps = {
  title: string
  open: boolean
  onClose:  () => void
  onSubmit: () => void
  loading: boolean
  type: "delete" | "remove"
  content?: string | false
}

export default function DeleteConfirmPopup({ open, onClose, loading, onSubmit, title, type, content = false }: DeleteConfirmPopupProps) {


  const handleDelete = async () => {
    await onSubmit();
    onClose();
  };

  return (
    <Popup open={open} onClose={onClose}>
      <Div className="w-[95vw] lg:w-[35vw] shadow  bg-white rounded-theme p-5 pt-4">
        <Div className="flex items-center justify-between border-b pb-2">
        <Typography>Are you sure you want to {type === "delete" ? "delete" : "remove"} this {title}?</Typography>

        </Div>
        <Div className="flex flex-col pl-1 pb-2 gap-[8px] w-full overflow-auto style-scroll pr-3 mt-[8px]">
            { content !== false && <Typography className="text-[15px]" >{content}</Typography>}
        </Div>
        <Div className="mt-[30px] flex justify-end gap-3">
          <Button onClick={onClose} className="!h-[2rem] w-[5rem] border-black !bg-gray-200 hover:!bg-gray-300 !text-black">
            Close
          </Button>
          <Button onClick={handleDelete} disabled={loading} className="!h-[2rem] !w-[6rem] !bg-red-600">
           {loading ? <LoadingIcon className="animate-spin" /> : "Delete"}
          </Button>
        </Div>

      </Div>
    </Popup>
  );
}
