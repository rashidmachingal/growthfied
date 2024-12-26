import Link from 'next/link'
import { Div, Typography } from '@/interface/fragments'
import { AtSymbolIcon, CircleStackIcon, DeliveryIcon, LockOutlineIcon, PageOutlineIcon, PaymentOutlineIcon, SeoOutlineIcon, StoreIcon } from '@/interface/icons'

type SettingsSidebarProps = {
    active: string
}

export default function SettingsSidebar({ active }: SettingsSidebarProps) {
  return (
    <Div className="flex flex-col gap-[5px] mt-2 w-full" >
        <Link href="/dashboard/settings/storename" className={`${active === "user_name" && "bg-white"} hover:bg-white px-[6px] py-[6px] rounded-[3px] cursor-pointer flex items-center gap-1`} >
          <CircleStackIcon/>
          <Typography className="text-[12px] font-medium" >Store Domain</Typography>
        </Link>
        <Link href="/dashboard/settings/store-info"  className={`${active === "store_info" && "bg-white"} hover:bg-white px-[6px] py-[6px] rounded-[3px] cursor-pointer flex items-center gap-1`} >
          <StoreIcon/>
          <Typography className="text-[12px]" >Store Information</Typography>
        </Link>
        <Link href="/dashboard/settings/payment-method" className={`${active === "payment_method" && "bg-white"} hover:bg-white px-[6px] py-[6px] rounded-[3px] cursor-pointer flex items-center gap-1`} >
          <PaymentOutlineIcon/>
          <Typography className="text-[12px] font-medium" >Payment Method</Typography>
        </Link>
        <Link href="/dashboard/settings/delivery-charge" className={`${active === "delivery_charge" && "bg-white"} hover:bg-white px-[6px] py-[6px] rounded-[3px] cursor-pointer flex items-center gap-1`} >
          <DeliveryIcon/>
          <Typography className="text-[12px] font-medium" >Delivery Charge</Typography>
        </Link>
        <Link href="/dashboard/settings/seo" className={`${active === "seo" && "bg-white"} hover:bg-white px-[6px] py-[6px] rounded-[3px] cursor-pointer flex items-center gap-1`} >
          <SeoOutlineIcon/>
          <Typography className="text-[12px] font-medium" >SEO</Typography>
        </Link>
        <Link href="/dashboard/settings/email"  className={`${active === "email" && "bg-white"} hover:bg-white px-[6px] py-[6px] rounded-[3px] cursor-pointer flex items-center gap-1`} >
          <AtSymbolIcon/>
          <Typography className="text-[12px]" >Email</Typography>
        </Link>
        <Link href="/dashboard/settings/password" className={`${active === "password" && "bg-white"} hover:bg-white px-[6px] py-[6px] rounded-[3px] cursor-pointer flex items-center gap-1`} >
          <LockOutlineIcon className="!w-4 !h-4" />
          <Typography className="text-[12px]" >Password</Typography>
        </Link>
        <Link href="/dashboard/settings/footer" className={`${active === "footer" && "bg-white"} hover:bg-white px-[6px] py-[6px] rounded-[3px] cursor-pointer flex items-center gap-1`} >
          <PageOutlineIcon className="!w-4 !h-4" />
          <Typography className="text-[12px]" >Footer</Typography>
        </Link>
    </Div>
  )
}
