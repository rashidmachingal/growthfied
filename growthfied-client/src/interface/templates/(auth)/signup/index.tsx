import Link from "next/link";
import { Typography } from "@/interface/fragments";
import { AuthBox, Signup } from "@/interface/components";
import { Suspense } from "react";
import { LoadingIcon } from "@/interface/icons";

export default function RegisterTemplate() {
  return (
    <AuthBox title="Create your online store" >
        <Suspense fallback="loading..." >
        <Signup/>
        </Suspense>
        <Typography className="flex items-center justify-center gap-2 mt-4 text-sm" >
        Already have account?
        <Link href="/login" className="underline" >Log In</Link>
     </Typography>
     <Typography className="mt-3 flex flex-wrap gap-1 justify-center text-gray-400 text-xs" >
        By signing up, you agree to our 
        <Link href="/terms-and-conditions" className="text-black" >Terms & Conditions</Link>
        and <Link href="/privacy-policy" className="text-black" >Privacy Policy</Link>
     </Typography>
    </AuthBox>
  )
}
