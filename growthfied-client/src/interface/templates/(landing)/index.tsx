import { Break, Button, Div, Section, Span, Typography } from "@/interface/fragments";
import { Faq, LandingLayout, PricingBox, QuickStarter, WhastappWidjet, WhatsappNumber } from "@/interface/components";
import Image from "next/image";

export default function HomeTemplate() {
  return (
    <LandingLayout>
      <Section className="flex justify-center items-center px-[1rem] h-[23rem] bg-gray-200" >
      <Div className="" >
        <Typography variant="h1" className="text-black text-center !text-[23px] sm:text-[27px] xm:!text-[36px] xm:leading-[48px] text-h font-bold" >
           Build Your e-commerce <Break/> Website Easily
        </Typography>
        <Typography className="text-center mt-[8px] block xl:hidden" >
          The simplest way of build your online store, it&apos;s
          easier than you think.
        </Typography>
        <Typography className="text-center mt-[8px] hidden xl:block" >
          The simplest way of build your online store, <Break/> it&apos;s
          easier than you think.
        </Typography>
        <Div className="mt-[23px] flex gap-2 justify-center w-full" >
         <Button type="link" url="/create-store" className="w-[12rem]" >Get started for free</Button>
        </Div>
        <Image className="absolute left-[50%]" src="/settings/arrow.svg" width={100} height={100} alt="arrow" />
      </Div>
      </Section>
      <Section className="py-4 px-5 md:px-32 flex justify-center" >
        <Image width={1000} height={1000} className="rounded-theme border border-black w-[60rem]" src="/settings/landing.png" alt="" />
      </Section>
    
      <Section className="flex flex-col items-center border-t bg-[url('https://assets-global.website-files.com/5e941e9c459693aeff757d94/641ae44fcafe627b746be4d5_sb%20smilde.svg')]" id="pricing" >
       <Typography variant="h3" className="mt-3 xm:mt-5 font-medium !text-[20px]" >Pricing Details</Typography>
       <PricingBox/>
      </Section>

      <Section className="w-full h-[18rem] bg-teritory mt-10 flex flex-col items-center justify-center" id="contact" >
        <Typography variant="h2" className="mt-6 font-semibold text-center" >Need help at whatsapp?</Typography>
        <Typography className="text-center" >Need WhatsApp help for your e-commerce store setup? fill your whatsapp number</Typography> 
        <WhatsappNumber/> 
      </Section>

      <Section className="flex flex-col items-center" id="faq" >
       <Typography variant="h3" className="font-medium mt-3 xm:mt-5" >Faq</Typography>
       <Faq/>
      </Section>

      <WhastappWidjet/>

    </LandingLayout>
  );
}
