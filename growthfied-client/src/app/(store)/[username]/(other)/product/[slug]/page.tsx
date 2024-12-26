import { StoreProductTemplate } from "@/interface/templates";
import { BACKEND_URL } from "../../../../../../../config";
import { notFound } from "next/navigation";
import { NotFound } from "@/interface/components";
import { Metadata, ResolvingMetadata } from "next";

type PageProps = {
  params: { slug: string, username: string };
  searchParams: { [key: string]: string | string[] | undefined }
}


async function getSingleProduct(store_name: string, slug: string) {
  const res = await fetch(
    `${BACKEND_URL}/store/products/get-single-product/${store_name}/${slug}`,
    { next: { tags: ["product"] } }
  )
  const data = await res.json();
  if (res.status === 404) return { ...data, error_status: true}
  if (res.status === 200) return { ...data, error_status: false };
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const res = await getSingleProduct(params.username, params.slug)
  return {
    title: res?.seo?.meta_title,
    description: res?.seo?.meta_description,
  }
}

export default async function Page({ params }: PageProps) {

  const store_name = decodeURIComponent(params.username).replace(/@/g, "")
  const product = await getSingleProduct(store_name, params.slug)

  return (
    <>
     { product.error_status === false ? 
      <StoreProductTemplate product={product} /> : 
      <NotFound type="product" /> 
     }
    </>
  )
}
