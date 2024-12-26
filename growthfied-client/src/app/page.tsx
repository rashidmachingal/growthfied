import { AuthProtection } from "@/interface/components";
import { HomeTemplate } from "@/interface/templates";

export default function Page() {
  return (
    <>
    <AuthProtection/>
    <HomeTemplate/>
    </>
  )
}
