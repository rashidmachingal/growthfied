import { Main } from "@/interface/fragments";
import { NotFound, StoreBottomNavbar, StoreDataFail, StoreFooter, StoreHomeTopbar, StoreTopbar } from "@/interface/components";

type StoreHomeLayoutProps = {
  children: React.ReactNode, 
  store?: {
    status: "not-found" | "deactivated" | "active" | "failed"
    store_name: string
    profile_picture: string
    bio: string
    display_name: string
  },
  store_name: string
  pages: any
  footer: string
}

export default function StoreHomeLayout({ store, children, store_name, pages, footer }: StoreHomeLayoutProps) {

  return (
  <>

  {store?.status === "failed" && (
    <StoreDataFail store_name={store_name} />
  )}
  
  {store?.status === "active" && (
    <>
    <StoreTopbar store={store} />
     <Main className="flex flex-col items-center mt-[2.8rem] md:mt-[5rem] pb-[8rem] md:pb-[5rem] w-full bg-[url('https://assets-global.website-files.com/5e941e9c459693aeff757d94/641ae44fcafe627b746be4d5_sb%20smilde.svg')] " >
     {children}
     </Main>
     <StoreBottomNavbar store_name={String(store?.store_name)} />
     <StoreFooter footer={footer} pages={pages} />
    </>
  )}

  {store?.status === "deactivated" && (
     <NotFound type="deactivated" />
  )}
  </>
  )
}

