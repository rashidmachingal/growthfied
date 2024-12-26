import Link from "next/link";
import Image from "next/image";
import { Div, Nav, Typography } from "@/interface/fragments";
import { Avatar, CartCount, SearchBar, StoreSideBar } from "@/interface/components";
import { BACKEND_URL } from "../../../../../config";
import { HamburgerIcon, SearchIcon } from "@/interface/icons";

type StoreTopbarProps = {
  store?: {
    store_name: string
    profile_picture: string
  }
}

export default function StoreTopbar({ store }: StoreTopbarProps) {
  return (
    <Nav className="w-full flex md:flex-row pl-[12px] pr-[8px] shadow-xl h-[4.6rem]  items-center justify-between gap-[15px] md:shadow-md md:px-[15rem] md:py-0 md:h-[4.6rem] fixed top-0 bg-white !z-[100] !" >
      <StoreSideBar/>
      <Link href={`/`} className="flex items-center gap-2 w-full md:w-auto" >
         {store?.profile_picture !== "no_profile" ? 
         <Image 
           width={200} 
           height={200} 
           className="w-[3rem] h-[3rem] md:w-[3.5rem] md:h-[3.5rem] rounded-full object-center object-cover shadow"  
           src={`${BACKEND_URL}/public/images/profiles/${store?.profile_picture}`} 
           alt="logo" />
           : <Avatar 
              letter={store?.store_name.charAt(0).toUpperCase()}
              className="!rounded-full !w-[3.5rem] !h-[3.5rem] !text-[20px] !bg-black border-gray-300 border-[4px] cursor-pointer" 
             />
         }
         <Div>
         <Typography className="font-semibold flex items-center gap-1 text-[15px] md:text-[18px]" >
          {store?.store_name}
          {/* <VerifiedIcon/> */}
         </Typography>
         </Div>
      </Link>

      <Div className="flex lg:flex items-center justify-end gap-5 md:w-auto">
          
          <Link href={`/categories`} className="hidden md:flex cursor-pointer hover:underline text-[14px]" >
            <Typography>Categories</Typography>
          </Link>
          <Link href={`/track-order`} className="hidden md:flex cursor-pointer hover:underline text-[14px]" >
            <Typography>Track Order</Typography>
          </Link>

          <Div className="flex items-center md:gap-[5px]" >
          <SearchBar/>
          <Link href={`/cart`} className="cursor-pointer" >
            <CartCount/>
          </Link>
          </Div>
          
      </Div>
    </Nav>
  )
}
