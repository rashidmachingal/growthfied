"use client"

import { OrdersList, PageHeader } from "@/interface/components";
import { Button } from "@/interface/fragments";
import { ReFreshIcon } from "@/interface/icons";
import { Suspense, useState } from "react";

export default function OrdersTemplate() {

  const [reFetch, setReFetch] = useState(false)
  const [reLoading, setReLoading] = useState(false)

  return (
    <>
    <PageHeader title="Orders" >
      <Button onClick={()=> {
        setReFetch(prev=> !prev)
        setReLoading(true)
      }} className="gap-[5px]" >
        <ReFreshIcon className={`${reLoading && "animate-spin"}`} />
        Refresh
      </Button>
    </PageHeader>
    <Suspense fallback="loading..." >
    <OrdersList setReLoading={setReLoading} reFetch={reFetch} />
    </Suspense>
    </>
  )
}
