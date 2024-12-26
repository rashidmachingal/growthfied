"use client"

import { Suspense, useState } from "react";
import { Button } from "@/interface/fragments";
import { CoupensList, PageHeader } from "@/interface/components";
import { AddOutlineIcon } from "@/interface/icons";


export default function CoupensTemplate() {

  const [isFetched, setIsFetched] = useState(false)

  return (
    <>
    <PageHeader title="Discount Coupens">
      <Button type="link" url="/dashboard/coupens/create" className="gap-2" >
        <AddOutlineIcon/>Create Coupen
      </Button>
    </PageHeader>
    <Suspense>
    <CoupensList isFetched={isFetched} setIsFetched={setIsFetched} />
    </Suspense>
    </>
  );
}
