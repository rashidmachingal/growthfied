import { notFound } from "next/navigation";
import { StoreCategoriesTemplate } from "@/interface/templates";
import { Metadata, ResolvingMetadata } from "next";
import { BACKEND_URL } from "../../../../../../config";

type PageProps = {
  params: { username: string };
}

// get all categories
async function getAllCategories(username: string) {
  const res = await 
  fetch(`${BACKEND_URL}/store/categories/get-all-categories/${username}`, 
  { next: { tags: ["category"]}}
  )
  return res.json()
}

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Shop diverse categories for your needs',
}

export default async function Page({ params }: PageProps) {
  const storename = decodeURIComponent(params.username).replace(/@/g, "");
  const categories = await getAllCategories(storename);

  return (
    <StoreCategoriesTemplate storename={storename} categories={categories} />
  )
}
