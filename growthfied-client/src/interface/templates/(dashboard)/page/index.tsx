"use client"

import { Suspense, useState } from "react";
import { PageHeader, PagesList } from "@/interface/components";
import { Button } from "@/interface/fragments";
import { AddOutlineIcon } from "@/interface/icons";

export default function PageTemplate() {

  const [isFetched, setIsFetched] = useState(false)

  return (
    <>
    <PageHeader title="Pages" >
      <Button type="link" url="/dashboard/pages/create" className="gap-[5px]" >
        <AddOutlineIcon/>
        Add Page
      </Button>
    </PageHeader>
    <Suspense fallback="loading..." >
    <PagesList isFetched={isFetched} setIsFetched={setIsFetched} />
    </Suspense>
    </>
  )
}
