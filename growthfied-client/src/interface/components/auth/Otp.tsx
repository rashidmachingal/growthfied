"use client"

import { useState } from "react";
import { Div, Typography } from "@/interface/fragments";
import OTPInput from "react-otp-input";

type OTPProps = {
  onChange: any
  otp: any
  email: string
  containerStyle?: string
}

export default function OTP({ onChange, otp, email, containerStyle }: OTPProps) {
  return (
    <Div className={`mt-[18px] ${containerStyle}`} >
      <Typography>
        Enter 4 digit otp we sented to your email {email}
      </Typography>

      <OTPInput
        value={otp}
        onChange={onChange}
        numInputs={4}
        containerStyle={"mt-3 w-full flex justify-center gap-3"}
        inputStyle={
          "px-3 h-theme rounded-theme outline-none glowing-border border !w-[25%] !h-[3.6rem] outline-none focus:border-primary text-center text-[25px] rounded-theme"
        }
        renderInput={(props) => <input {...props} />}
        shouldAutoFocus
        inputType="tel"
      />
    </Div>
  );
}
