"use client"

import { ReactNode, useState } from "react";
import { Div, Main } from "@/interface/fragments";
import { AuthProtection, CompleteProfile, DashboardSidebar, DashboardTopbar } from "@/interface/components";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {

  const { on_boarding } = useUserStore()
  const [toggleSidebar, setToggleSidebar] = useState(false)

  return (
    <>
      { on_boarding === false && <CompleteProfile/>}
      <AuthProtection/>
      <DashboardTopbar toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
      <DashboardSidebar toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
      <Main className="mt-[4.2rem] vmd:pl-[14.6rem] min-h-[calc(100vh-4.2rem)] bg-[#f1f1f1]">
       <Div className="p-[14px] md:px-[1.8rem]" >
        {children}
       </Div>
      </Main>
    </>
  );
}
