"use client"

import {PlainButton } from "@/interface/fragments"
import Image from "next/image"
import { useEffect } from "react"

type WhatsappWidjetProps = {
  isDashboard?: boolean
}

export default function WhastappWidjet({ isDashboard = false }: WhatsappWidjetProps) {

    const handleClick = () => {
       if(isDashboard){
        if(window){
          window.location.replace("https://api.whatsapp.com/send?phone=+918137901840&text=Hi")
        }
       }else{
        if(window){
          window.location.replace("https://api.whatsapp.com/send?phone=+918137901840&text=Hello, Can you tell more about Growthfied?")
        }
       }
    }

  return (
    <PlainButton onClick={handleClick} className="fixed bottom-[13px] right-[13px]" >
        <Image src="/settings/whatsapp.svg" width={43} height={43} alt="whatsapp" />
    </PlainButton>
  )
}