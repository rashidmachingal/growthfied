// fragments
import { Div, Typography } from "@/interface/fragments";

// components
import { Logo } from "@/interface/components";

// icons
import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/interface/icons";
import Link from "next/link";
import YoutubeIcon from "@/interface/icons/YoutubeIcon";

export default function Footer() {
  return (
    <Div className="w-full border gap-1 bg-black py-8 px-5 lg:px-52 flex justify-between flex-wrap mt-16">
      <Div>
       <Logo className=" w-[8rem] xm:w-[10rem]" color="white" />
       <Typography className="mt-3 w-[95%] lg:w-[30rem] text-gray-100" >
       Growthfied is the solution for effortlessly creating your online store. Our user-friendly platform simplifies every step of building your e-commerce website, allowing you to get started quickly and easily.

       </Typography>
       <Typography className="text-white font-medium mt-3 text-center md:text-left" >© 2024 Growthfied - All Rights Reserved</Typography>
      </Div>
      <Div className="w-full lg:w-auto flex items-center justify-center gap-3 mt-5 lg:mt-0" >
        <Link href="https://instagram.com/growthfied" >
         <InstagramIcon/>
        </Link>
        <Link href="https://youtube.com/@growthfied" >
         <YoutubeIcon/>
        </Link>
        <Link href="https://x.com/@growthfied" >
         <TwitterIcon/>
        </Link>
        <Link href="https://facebook.com/growthfied" >
         <FacebookIcon/>
        </Link>
      </Div>
    </Div>
  );
}
