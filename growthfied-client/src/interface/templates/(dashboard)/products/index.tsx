"use client"

import { Suspense, useState } from "react";
import { Button } from "@/interface/fragments";
import { PageHeader, ProductsList } from "@/interface/components";
import { AddOutlineIcon } from "@/interface/icons";

export default function ProductsTemplate() {

  const [isFetched, setIsFetched] = useState(false)

  return (
    <>
      <PageHeader title="Products" >
        <Button type="link" url="/dashboard/products/create" className="gap-2" >
          <AddOutlineIcon/> 
          Add Product
        </Button>
      </PageHeader>
      <Suspense>
      <ProductsList isFetched={isFetched} setIsFetched={setIsFetched} />
      </Suspense>
    </>
  )
}
