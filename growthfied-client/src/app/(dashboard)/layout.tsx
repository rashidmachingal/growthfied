import { DashboardLayout, WhastappWidjet } from "@/interface/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Growthfied",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <DashboardLayout>{children}</DashboardLayout>
    <WhastappWidjet isDashboard />
    </>
  );
}
