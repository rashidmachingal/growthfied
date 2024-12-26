"use client"

import Link from "next/link";
import Image from "next/image";
import { Button, Div, Typography } from "@/interface/fragments";
import { EyeIcon, LinkIcon } from "@/interface/icons";
import { Avatar } from "@/interface/components";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { toast } from "sonner";
import copy from 'copy-text-to-clipboard';
import { BACKEND_URL, DOMAIN_NAME } from "../../../../../config";


export default function ProfileLink() {

  const { username, profile_picture, loading, domain_name, is_domain_enabled } = useUserStore()

  const handleCopy = () => {
   if(is_domain_enabled){
      navigator?.clipboard?.writeText(`https://${domain_name}`)
      copy(`https://${domain_name}`);
      toast.success("Profile link copied")
      return
   }else{
      navigator?.clipboard?.writeText(`https://${username}.${DOMAIN_NAME}`)
      copy(`https://${username}.${DOMAIN_NAME}`);
      toast.success("Profile link copied")
   }
  }

  return (
    <Div className="flex flex-col lg:flex-row items-baseline lg:items-center justify-between pr-0 md:pr-3" >
        <Div className="flex items-center flex-wrap justify-center gap-3" >

        { loading ?
         <Div className="w-[3.5rem] h-[3.5rem] rounded-full placeholder-animation"></Div> : 
         <>
         { profile_picture === "no_profile" 
          ? <Avatar className="!rounded-full !w-[3.5rem] !h-[3.5rem] !text-[20px] !bg-primary" letter={username.charAt(0).toUpperCase()} />
          : <Image width={200} height={200} className="w-[3.5rem] h-[3.5rem] rounded-full object-center object-cover shadow-lg" src={`${BACKEND_URL}/public/images/profiles/${profile_picture}`} alt="img" />
         }
         </>
        }
        
         { loading ? <Div className="w-[15rem] md:w-[18rem] rounded-[2px] h-[2rem] placeholder-animation"></Div>
         : (
            <>
            { is_domain_enabled ? ( <Link href={`https://${domain_name}`} target="_blank" >
            <Typography className="font-medium text-[13px] md:text-[15px]" >{domain_name}</Typography>
           </Link>) : (
             <Link href={`https://${username}.${DOMAIN_NAME}`} target="_blank" >
             <Typography className="font-medium text-[13px] md:text-[15px]" >{username}.{DOMAIN_NAME}</Typography>
            </Link>
           )}
            </>
         )}
        </Div>
        <Div className="flex gap-2 mt-[9px] lg:mt-0 w-full md:w-auto" >
         <Button onClick={handleCopy} className="rounded-full gap-1 w-full md:w-auto" >
            <LinkIcon/>
            Copy Link
         </Button>
         { is_domain_enabled ? (
         <Button target="_blank" type="link" url={`https://${domain_name}`} className="rounded-full gap-1 w-full md:w-auto" >
            <EyeIcon/>
            Visit Your Store
         </Button>
         ) : (
         <Button target="_blank" type="link" url={`https://${username}.${DOMAIN_NAME}`} className="rounded-full gap-1 w-full md:w-auto" >
            <EyeIcon/>
            Visit Your Store
         </Button>
         )}
        
        </Div>
    </Div>
  )
}
