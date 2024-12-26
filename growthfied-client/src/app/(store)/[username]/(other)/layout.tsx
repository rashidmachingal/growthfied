import { LoadAnalyticsScript, StoreLayout } from "@/interface/components";
import { BACKEND_URL } from "../../../../../config";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

type LayoutProps = { 
   children: React.ReactNode, 
   params: { username: string}
}

type Props = {
  params: { username: string }
}

async function getStoreDetails(username: string) {
  const res = await fetch(`${BACKEND_URL}/store/common/get-store-details/${username}`, { next: { tags: ["store"]}})
  const data = await res.json()
  if(res.status === 404) return notFound()
  if(res.status === 204) return { ...data, status: "deactivated" }
  if(res.status === 200) return { ...data, status: "active"}
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const res = await getStoreDetails(params.username)

  return {
    title: res.meta_title,
    description: res.meta_description,
    ...(res.favicon !== "no-favicon" && {
      icons: {
        icon: `${BACKEND_URL}/public/images/favicons/${res.favicon}`,
      },
    }),
  }
}

export default async function Layout({ children, params }: LayoutProps) {

  const store = await getStoreDetails(decodeURIComponent(params.username).replace(/@/g, ''))
  
  return (
    <>
    <LoadAnalyticsScript analytics_id={store?.analytics_id} />
    <StoreLayout footer={store?.footer} store={store} pages={store.pages} >
      {children}
    </StoreLayout>
    </>
  )
}