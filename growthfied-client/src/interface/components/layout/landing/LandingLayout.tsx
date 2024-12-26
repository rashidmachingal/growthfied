import { ReactNode } from "react";
import { Main } from "@/interface/fragments";
import { LandingFooter, LandingNavbar } from "@/interface/components";

type LandingLayoutProps = {
  children: ReactNode;
};

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <>
      <LandingNavbar />
      <Main className="mt-[4.4rem]">{children}</Main>
      <LandingFooter />
    </>
  );
}
