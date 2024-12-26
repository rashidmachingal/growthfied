"use client";

import { Suspense, useState } from "react";
import { Button } from "@/interface/fragments";
import { AddOutlineIcon } from "@/interface/icons";
import { CategoriesList, CreateCategoryPopup, PageHeader } from "@/interface/components";

export default function CategoriesTemplate() {

  const [isFetched, setIsFetched] = useState(false)
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false)

  return (
    <>
      <PageHeader title="Categories">
        <Button onClick={()=> setCreateCategoryOpen(true)} className="gap-2">
          <AddOutlineIcon />
          Create Category
        </Button>
      </PageHeader>
      <CreateCategoryPopup setIsFetched={setIsFetched} open={createCategoryOpen} onClose={()=> setCreateCategoryOpen(false)} />
      <Suspense>
      <CategoriesList isFetched={isFetched} setIsFetched={setIsFetched} />
      </Suspense>
    </>
  );
}
