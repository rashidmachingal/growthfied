"use client";

// react
import { ReactNode, useEffect } from "react";

// fragments
import { Div } from "@/interface/fragments";
import OutsideClickHandler from "react-outside-click-handler";

type PopupProps = {
  open: boolean;
  onClose?: () => void;
  children: ReactNode
};

export default function Popup({ open, onClose, children }: PopupProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }else{
        document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [open]);

  return (
    <>
      {open && (
        <Div className="w-full overflow-hidden h-[100vh] bg-[#2a2a2a8a] fixed top-0 left-0 z-[100] flex items-center justify-center">
            <OutsideClickHandler onOutsideClick={()=> {
                if(onClose){ onClose() }
            }} >
            {children}
            </OutsideClickHandler>
        </Div>
      )}
    </>
  );
}
