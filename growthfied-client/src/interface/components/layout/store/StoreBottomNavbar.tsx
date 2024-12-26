import Link from "next/link";
import { Div, Typography } from "@/interface/fragments";
import { CartCount } from "@/interface/components";
import { CategoriesOutlineIcon, HomeOutlineIcon, OrdersOutlineIcon } from "@/interface/icons";

type StoreBottomNavbarProps = {
  store_name: string
}

export default function StoreBottomNavbar({ store_name }: StoreBottomNavbarProps) {
  return (
    <Div className="fixed flex items-center justify-between w-screen h-[3.5rem] bg-gray-50 border-t-gray-200 border-t bottom-0 lg:hidden" >
      <Link href={`/`} className="w-[33.33333333%] border-r border-r-gray-200 h-full flex flex-col items-center justify-center" >
        <HomeOutlineIcon/>
        <Typography className="text-[10px]" >Home</Typography>
      </Link>
      <Link href={`/categories`} className="w-[33.33333333%] border-r border-r-gray-200 h-full flex flex-col items-center justify-center" >
        <CategoriesOutlineIcon/>
        <Typography className="text-[10px]" >Categories</Typography>
      </Link>
      {/* <Link href={`/cart`} className="w-[33.33333333%] border-r border-r-gray-200 h-full flex flex-col items-center justify-center" >
        <CartCount/>
        <Typography className="text-[10px]" >Cart</Typography>
      </Link> */}
      <Link href={`/track-order`} className="w-[33.33333333%] border-r border-r-gray-200 h-full flex flex-col items-center justify-center" >
        <OrdersOutlineIcon/>
        <Typography className="text-[10px]" >Track Order</Typography>
      </Link>
    </Div>
  )
}
