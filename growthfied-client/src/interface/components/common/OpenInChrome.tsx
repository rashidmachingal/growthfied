"use client"

import  { useEffect } from 'react'

export default function OpenInChrome() {
    useEffect(() => {
        if(navigator.userAgent.includes("Instagram")){
          if(navigator.userAgent.includes("iPad") || navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPode")){
            window.location.href = `googlechrome://${window.location.href}`;
            return
          }
          window.location.href = `intent:${window.location.href}#Intent;end`;
         }
        }, [])
  return (
    null
  )
}
