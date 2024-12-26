import { StoreCategoryViewTemplate } from "@/interface/templates";
import { BACKEND_URL } from "../../../../../../../config";
import { Metadata, ResolvingMetadata } from "next";

type PageProps = {
  params: { username: string, id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getCategoryName(id: string) {
  const res = await fetch(
    `${BACKEND_URL}/store/categories/get-category-name/${id}`,
    { next: { tags: ["category"] } }
  )
  return res.json();
}

async function getProductsByCategory(username: string, id: string) {
  const res = await fetch(
    `${BACKEND_URL}/store/categories/get-products-by-category/${username}/${id}`,
    { next: { tags: ["category"] } }
  )
  return res.json();
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {

  const res = await getCategoryName(params.id)

  return {
    title: `${res.category_name}`,
    description: `Shop Products at ${res.category_name}`,
  }
}

export default async function Page({ params, searchParams }: PageProps) {

  const storename = decodeURIComponent(params.username).replace(/@/g, "");
  const products = await getProductsByCategory(storename, params.id);
  const category = await getCategoryName(params.id);
  
  return (
    <StoreCategoryViewTemplate 
     storename={storename} 
     products={products}
     searchParams={searchParams}
     category_id={params.id}
     category_name={category.category_name}
    /> 
  )
}
