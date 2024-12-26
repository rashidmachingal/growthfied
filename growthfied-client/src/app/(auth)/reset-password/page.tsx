import { ResetPasswordTemplate } from "@/interface/templates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Growthfied",
};

export default function Page() {
  return <ResetPasswordTemplate/>
}
