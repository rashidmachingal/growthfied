import { StoreHomeTemplate } from "@/interface/templates";
import { notFound } from "next/navigation";
import { BACKEND_URL } from "../../../../../config";

type PageProps = {
  params: { username: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getStoreDetails(username: string) {
  const res = await fetch(
    `${BACKEND_URL}/store/common/get-store-details/${username}`,
    { next: { tags: ["store"] } }
  );
  const data = await res.json();
  if (res?.status === 404) return notFound();
  if (res?.status === 200) return { ...data, status: "active" };
}

async function getAllProducts(username: string) {
  const res = await fetch(
    `${BACKEND_URL}/store/products/get-all-products/${username}`,
    { next: { tags: ["product"] } }
  );
  return res.json();
}

export default async function Page({ params, searchParams }: PageProps) {
  const storename = decodeURIComponent(params.username).replace(/@/g, "");
  const products = await getAllProducts(storename);
  const store = await getStoreDetails(storename);

  return (
    <>
      <StoreHomeTemplate
        products={products}
        store={store}
        storename={store?.storename}
        bio={store?.bio}
        searchParams={searchParams}
      />
    </>
  );
}
