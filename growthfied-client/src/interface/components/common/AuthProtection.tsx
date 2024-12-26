"use client"

import { useEffect, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUserStore } from "@/zustand/dashboard/dashboardStore"
import Cookies from "universal-cookie"

export default function AuthProtection() {

    const router = useRouter()
    const pathname = usePathname()
    const { unauthorized } = useUserStore()

    const cookies = useMemo(() => new Cookies(), [])
    const redirectPaths = useMemo(() => ["/", "/login", "/create-storestarted", "/reset-password"], [])

    useEffect(() => {
        if(cookies.get("token")) {
            if(redirectPaths.includes(pathname)){
                router.push("/dashboard")
            }
        } else {
            if(pathname.includes("/dashboard")){
                router.push("/login")
            }
        }
    }, [router, cookies, redirectPaths, pathname, unauthorized])
    
  return <></>
}
