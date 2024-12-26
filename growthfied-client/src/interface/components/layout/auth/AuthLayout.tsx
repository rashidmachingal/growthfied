// react
import { ReactNode } from "react";

// fragments
import { Main } from "@/interface/fragments";

// components
import { AuthNavbar } from "@/interface/components";

type AuthLayoutProps = {
    children: ReactNode;
  };

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <AuthNavbar />
      <Main className="mt-[4.2rem]">{children}</Main>
    </>
  )
}
