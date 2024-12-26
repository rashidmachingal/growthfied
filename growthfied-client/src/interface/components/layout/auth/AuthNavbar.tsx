// next
import Link from "next/link";

// fragments
import { Nav } from "@/interface/fragments";

// components
import { Logo } from "@/interface/components";

export default function AuthNavbar() {
  return (
    <Nav className="h-[4.2rem] px-5 lg:px-32 flex items-center justify-between bg-teritory fixed w-full top-0" >
        <Link href="/" >
         <Logo className="mix-blend-multiply w-[8rem] xm:w-[10rem] lg:ml-[8rem]" color="black" />
        </Link>
    </Nav>
  )
}