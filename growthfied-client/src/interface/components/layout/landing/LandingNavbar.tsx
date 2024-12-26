import Link from "next/link";
import { Button, Div, Nav, Typography } from "@/interface/fragments";
import { Logo, LandingSideDrawer } from "@/interface/components";

export default function LandingNavbar() {
  return (
    <Nav className="py-4 px-5 lg:px-32 flex items-center justify-between bg-teritory z-[50] fixed w-full top-0" >
        <Div className="flex items-center gap-1" >
        <LandingSideDrawer/>
        <Link href="/" >
         <Logo className="mix-blend-multiply w-[8rem] xm:w-[10rem]" color="black" />
        </Link>
        </Div>
        <Div className="flex items-center gap-4" >
          <Link href="#pricing" className="mr-5 hidden md:flex" >
           <Typography className="hover:text-primary" >Pricing</Typography>
          </Link>
          <Link href="#faq" className="mr-5 hidden md:flex" >
           <Typography className="hover:text-primary" >FAQ</Typography>
          </Link>
          <Link href="#contact" className="mr-5 hidden md:flex" >
           <Typography className="hover:text-primary" >Contact</Typography>
          </Link>
        </Div>
        <Div className="flex gap-[10px]" >
           <Button type="link" url="/login" className="bg-white !text-black hover:!text-white !border-black border hover:!border-black !w-[6rem] xm:h-theme" >Login</Button>
          </Div>
    </Nav>
  )
}