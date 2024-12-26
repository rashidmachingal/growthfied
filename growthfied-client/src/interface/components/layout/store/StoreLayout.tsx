import { ReactNode, Suspense } from "react";
import { Main } from "@/interface/fragments";
import {  NotFound, StoreBottomNavbar, StoreFooter, StoreTopbar } from "@/interface/components"

type StoreLayoutProps = {
    children: ReactNode;
    store?: {
      status: "not-found" | "deactivated" | "active"
      store_name: string
      profile_picture: string
    }
    pages: any
    footer: string
};

export default function StoreLayout({ children, store, pages, footer } : StoreLayoutProps) {
  return (
    <>
    {store?.status === "active" && (
    <>
    <Suspense fallback="Loading....." >
     <StoreTopbar store={store} />
    </Suspense>
     <Main className="min-h-[calc(100vh-9rem)] pb-[2.5rem] mt-[1rem] lg:mt-[5rem] bg-[url('https://assets-global.website-files.com/5e941e9c459693aeff757d94/641ae44fcafe627b746be4d5_sb%20smilde.svg')]" >
      {children}
     </Main>
     {/* <StoreBottomNavbar store_name={String(store?.store_name)} /> */}
    <StoreFooter footer={footer} pages={pages} />
    </>
    )}
    {store?.status === "deactivated" && (
      <NotFound type="deactivated" />
    )}
    </>
  )
}
