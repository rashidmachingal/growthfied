"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Div, Typography } from "@/interface/fragments";
import { ArrowDownIcon, LogoutIcon } from "@/interface/icons";
import { Avatar } from "@/interface/components";
import { setAuthorization } from "@/@api/axios";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import Cookies from "universal-cookie";
import OutsideClickHandler from "react-outside-click-handler";
import Image from "next/image";
import { BACKEND_URL, DOMAIN_NAME } from "../../../../../config";
import { userLogout } from "@/@api/auth/auth.api";
import { toast } from "sonner";

export default function ProfileDropdown() {

  const router = useRouter()
  const { username, profile_picture, update_user } = useUserStore()

  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);

  const handleLogout = async () => {
    toast.loading("Loging out...",{ id: "@logout" })
    try {
      await userLogout()
      const cookies = new Cookies()
      setAuthorization(false)
      cookies.remove("token")
      update_user("","", true)
      window.location.reload()
      window.location.href = '/login'
      setAuthorization(false)
      cookies.remove("token", { path: "/"})
      update_user("","", true)
    } catch (error) {
      const cookies = new Cookies()
      setAuthorization(false)
      cookies.remove("token")
      update_user("","", true)
      window.location.reload()
      window.location.href = '/login'
      setAuthorization(false)
      cookies.remove("token", { path: "/"})
      update_user("","", true)
    }
  }

  return (
    <Div className="relative">
      <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
        <Div
          onClick={handleToggle}
          className={`flex items-center cursor-pointer hover:bg-[#3a3a3aac] py-[4px] pl-[5px] pr-[5px] rounded-[4px] shadow-white ${
            open && "bg-[#3a3a3aac]"
          } `}
        >
          {profile_picture && profile_picture !== "no_profile" ? 
          <Image 
            className="object-center object-cover w-[1.8rem] h-[1.8rem] rounded-theme" 
            alt="img" 
            width={70} 
            height={70} 
            src={`${BACKEND_URL}/public/images/profiles/${profile_picture}`} 
          /> : 
           <Avatar letter={username?.charAt(0)} />
          }
          
          <Typography className="text-[#f4f4f4] text-[12px] ml-[5px] hidden xm:flex">
           {username}
          </Typography>
          <ArrowDownIcon className="fill-white ml-[4px]" />
        </Div>
        {open && (
          <Div className="w-[13rem] bg-white rounded-[4px] rounded-t-none shadow absolute right-0 top-[55px] border-t-[3px] border-t-black">
            <Div className="flex items-center mt-2 border-b pb-2 pl-3 xm:hidden">
              <Typography className="text-black text-[12px] ml-[5px] xm:flex">
                @{username}
              </Typography>
            </Div>
            <Div className="p-[6px] flex flex-col">
              <Link target="_blank" href={`https://${username}.${DOMAIN_NAME}`} className="cursor-pointer w-full h-[2rem] p-2 flex items-center rounded-[3px] hover:bg-[#6868681a]">
                <Typography className="text-[14px] cursor-pointer">
                  Visit Your Store
                </Typography>
              </Link>
              <Link href="/dashboard/settings" className="cursor-pointer w-full h-[2rem] p-2 flex items-center rounded-[3px] hover:bg-[#6868681a]">
                <Typography className="text-[14px] cursor-pointer">
                  Settings
                </Typography>
              </Link>
              <Link href="/dashboard/subscription" className="cursor-pointer w-full h-[2rem] p-2 flex items-center rounded-[3px] hover:bg-[#6868681a]">
                <Typography className="text-[14px] cursor-pointer">
                  Subscription
                </Typography>
              </Link>
              <Div className="border-t">
                <Div onClick={handleLogout} className="w-full mt-1 h-[2rem] p-2 flex items-center gap-2 rounded-[3px] hover:bg-[#6868681a]">
                  <LogoutIcon className="" />
                  <Typography className="text-[14px] cursor-pointer">
                    Logout
                  </Typography>
                </Div>
              </Div>
            </Div>
          </Div>
        )}
      </OutsideClickHandler>
    </Div>
  );
}
