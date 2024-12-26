import Image from "next/image";
import Link from "next/link";
import { Div, Nav, Typography } from "@/interface/fragments";
import { Avatar, CartCount, SearchBar } from "@/interface/components";
import { BACKEND_URL } from "../../../../../config";
import { VerifiedIcon } from "@/interface/icons";

type StoreHomeTopbarProps = {
  store?: {
    store_name: string
    profile_picture: string
    bio: string
    display_name: string
  }
}

export default function StoreHomeTopbar({ store }: StoreHomeTopbarProps) {

  return (
    <Nav className="w-full " >
      <Div className="w-full hidden md:flex items-center justify-end gap-5 px-[5rem] py-6">
          <Link href={`/categories`} className="cursor-pointer hover:underline text-[14px]" >
            <Typography>Categories</Typography>
          </Link>
          <Link href={`/track-order`} className="cursor-pointer hover:underline text-[14px]" >
            <Typography>Track Order</Typography>
          </Link>
          <Link href={`/cart`} className="cursor-pointer" >
            <CartCount/>
          </Link>
      </Div>
      <Div className="flex items-center justify-center pt-3 md:pt-0" >
        <Div className="flex flex-col items-center" >
         {store?.profile_picture !== "no_profile" ?
          <Image
            width={350} 
            height={350} 
            src={`${BACKEND_URL}/public/images/profiles/${store?.profile_picture}`} alt="profile"
            className="w-[5.7rem] h-[5.7rem] rounded-full  object-center object-cover shadow-xl" 
          />
           : <Avatar 
              letter={store?.store_name.charAt(0).toUpperCase()}
              className="!rounded-full !w-[5.2rem] !h-[5.2rem] !text-[25px] !bg-black border-gray-300 border-[4px] cursor-pointer" 
             />
          }
         <Typography className="mt-[8px] font-semibold text-center flex items-center gap-[3px]" >
           {store?.store_name} <VerifiedIcon/>
          </Typography>
         <Typography className="text-center" >{store?.bio}</Typography>
        </Div>
      </Div>
      <Div className="mt-8" >
       <SearchBar className="!mt-0" />
      </Div>
    </Nav>
  )
}
