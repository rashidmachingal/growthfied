import { StorePageTemplate } from "@/interface/templates";
import { Metadata, ResolvingMetadata } from "next";
import { BACKEND_URL } from "../../../../../../../config";

type PageProps = {
  params: { url: string, username: string };
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getSinglePage(store_name: string, slug: string) {
  const res = await fetch(
    `${BACKEND_URL}/store/pages/get-single-page/${store_name}/${slug}`,
    { next: { tags: ["store"] } }
  )
  const data = await res.json();
  if (res.status === 404) return { ...data, error_status: true}
  if (res.status === 200) return { ...data, error_status: false };
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const res = await getSinglePage(params.username, params.url)
  return {
    title: `${res?.page_title} - ${params.username}`,
    description: `${res?.page_title} page for ${params.username}`,
  }
}

export default async function Page({ params }: PageProps) {

  const store_name = decodeURIComponent(params.username).replace(/@/g, "")
  const page = await getSinglePage(store_name, params.url)

  return (
    <>
    <StorePageTemplate page_data={page} />
    </>
  )
}
