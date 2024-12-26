import Image from "next/image";
import { Button, Div, Typography } from "@/interface/fragments";
import EmptyCartImage from "../../../../../public/settings/empty-cart.webp"

export default function CartEmpty() {
  return (
    <Div className="flex items-center justify-center w-full flex-col mt-6" >
      <Image src={EmptyCartImage} width={150} height={150} alt="cart empty img" />
      <Typography className="font-semibold mt-3" >Your Cart is Empty</Typography>
      <Typography className="text-[12px]" >Looks like you have not added anything to your cart</Typography>
      <Button type="link" url="/" className="mt-5" >SHOP NOW</Button>
    </Div>
  )
}
