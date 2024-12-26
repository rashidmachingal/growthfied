"use client"

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Div, Typography } from "@/interface/fragments";
import { BackButtonIcon } from "@/interface/icons";

type PageHeaderProps = {
  title: string
  children?: ReactNode
  className?: string
}

export default function PageHeader({ title, children, className }: PageHeaderProps) {

  const router = useRouter()

  return (
    <Div className={`flex items-center border-[#eae8e8] border-b justify-between sticky bg-[#f1f1f1] pt-[5px] pb-[15px] top-[67px] z-[49] ${className}`} >
      <Div className="flex items-center gap-2" >
          <Div onClick={()=> router.back()} className="hover:bg-[#d6d4d4c6] cursor-pointer rounded-[2px] flex items-center justify-center w-[2rem] h-[1.5rem]" >
            <BackButtonIcon/>
          </Div>
          <Typography className="font-semibold text-[17px]" >{title}</Typography>
      </Div>
      {children}
    </Div>
  )
}
