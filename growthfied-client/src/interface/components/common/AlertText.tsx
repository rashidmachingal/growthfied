// react
import { ReactNode } from "react";

// fragments
import { Div, Typography } from "@/interface/fragments";

// icons
import { CloseIcon, ExclamationIcon, TickIcon } from "@/interface/icons";

type AlertTextTypes = {
  text: string;
  variant: "success" | "warning" | "info" | "danger";
  className?: string;
  children?: ReactNode
};


export default function AlertText({ text, variant, className, children }: AlertTextTypes) {

    const variantConfig = {
        success: {
          bgShadow: "bg-[#e8f9ee]",
          borderColor: "border-[#02c558]",
          bgColor: "bg-[#02c558]",
          textColor: "text-[#02c558]",
          icon: <TickIcon className="fill-white" />
        },
        info: {
          bgShadow: "bg-[#eafdff]",
          borderColor: "border-[#0985b7]",
          bgColor: "bg-[#0985b7]",
          textColor: "text-[#0985b7]",
          icon: <ExclamationIcon className="fill-white" />
        },
        warning: {
          bgShadow: "bg-[#fef9e9]",
          borderColor: "border-[#fcb617]",
          bgColor: "bg-[#fcb617]",
          textColor: "text-[#fcb617]",
          icon: <ExclamationIcon className="fill-white" />
        },
        danger: {
          bgShadow: "bg-[#feecea]",
          borderColor: "border-[#f8462d]",
          bgColor: "bg-[#f8462d]",
          textColor: "text-[#f8462d]",
          icon: <CloseIcon className="fill-white" />
        },
        default: {
          borderColor: "#02c558",
        },
      };

  const { bgShadow, borderColor, bgColor, textColor, icon } = variantConfig[variant] || variantConfig.default;

  return (
    <Div className={`${borderColor} ${bgShadow} w-full min-h-[3rem] rounded-theme border-[1px] border-solid flex items-center p-3 justify-between ${className}`}>
      <Div className="flex items-center gap-2">
        <Div className={`${borderColor} ${bgColor} p-1 rounded-xl`}>{icon}</Div>
        <Typography className={`font-[500] ${textColor} text-[13px] md:text-[15px]`}>{text}</Typography>
      </Div>
        {children}
    </Div>
  );
}
