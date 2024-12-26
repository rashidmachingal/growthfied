"use client";

// fragments
import {
  Button,
  Div,
  Form,
  InputField,
} from "@/interface/fragments";

export default function WhatsappNumber() {
  return (
    <form method="post" action="https://formspree.io/f/mzzbqyrl" className="flex flex-col xm:flex-row gap-3 mt-8 w-[85%] xm:w-auto">
      <InputField
        type="number"
        name="whatsapp_number"
        innerText="+91"
        placeHolder="whatsapp number"
        innerTextStyle="border-r pr-2 !pl-3"
        className="pl-[3.5rem] w-full"
      />
      <Div className="flex flex-col gap-1">
        <Button>Get Support</Button>
      </Div>
    </form>
  );
}
