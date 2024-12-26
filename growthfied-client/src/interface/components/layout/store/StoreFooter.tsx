import Image from "next/image";
import Link from "next/link";
import { Div, Typography } from "@/interface/fragments";
import SingleLogo from "../../../../../public/brand/single-logo.png"

type OutputFooterProps = {
  pages: any
  footer: string
}

export default function OutputFooter({ pages, footer }: OutputFooterProps) {
  return (
    <>
    <Div className="text-[13px] flex flex-col px-[2rem] md:px-[8rem] lg:px-[13.8rem] gap-4 w-full justify-center bg-gray-100 shadow-md border-b border-t py-[2.6rem]" >
      <Div className="flex flex-col items-start text-[13px] gap-[3px]" >
       <Typography className="text-[16px] font-semibold" >Pages</Typography>
       {pages?.map((page: any, index: number) => {
        return(
          <Link key={index} className={`${index === 0 && "mt-[5px]"}`} href={`/p/${page?.slug}`} >{page?.page_title}</Link>
        )
       })}
      </Div>
      <Div className="font-[500] whitespace-break-spaces" >
        {footer}
      </Div>
     </Div>
    <Div className="w-full min-h-[4rem] bg-gray-200 flex flex-col items-center justify-center py-2 mb-[3.5rem] md:mb-0" > 
     <Div className="flex items-center gap-3" >
        <Image src={SingleLogo} width={0} height={0} alt="logo" className="w-[2rem] h-[2rem] rounded-[50px]" />
        <Typography className="text-[12px]" >Create your own online store</Typography>
        <Link target="_blank" href="https://www.growthfied.com" className="text-[12px] hover:underline cursor-pointer" >Sign up</Link>
     </Div>
    </Div>
    </>
  );
}
