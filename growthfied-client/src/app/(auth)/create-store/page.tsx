import { SignupTemplate } from "@/interface/templates/";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Store - Growthfied",
  description: "Create you online store using Growthfied",
};

export default function Page() {
  return <SignupTemplate />;
}
