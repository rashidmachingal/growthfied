import type { Viewport } from 'next'
import { BACKEND_URL } from "../../../../../config";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { LoadAnalyticsScript, StoreHomeLayout } from '@/interface/components';

type LayoutProps = { 
   children: React.ReactNode, 
   params: { username: string}
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}
 
type Props = {
  params: { username: string }
}

async function getStoreDetails(username: string) {
    const res = await fetch(
      `${BACKEND_URL}/store/common/get-store-details/${username}`,
      { next: { tags: ["store"] } }
    )
    const data = await res.json();
    if (res?.status === 404) return notFound();
    if (res?.status === 200) return { ...data, status: "active" };
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const res = await getStoreDetails(params.username)

  return {
    title: res?.meta_title,
    description: res?.meta_description,
    ...(res?.favicon !== "no-favicon" && {
      icons: {
        icon: `${BACKEND_URL}/public/images/favicons/${res?.favicon}`,
      },
    }),
  }
}

export default async function Layout({ children, params }: LayoutProps) {

  const store = await getStoreDetails(params.username)

  return (
    <>
    <LoadAnalyticsScript analytics_id={store?.analytics_id} />
    <StoreHomeLayout footer={store?.footer} store={store} store_name={params.username} pages={store?.pages} >
      {children}
    </StoreHomeLayout>
    </>
  )
}