"use client"

import { useEffect, useState } from "react";
import { OrderDetails, PageHeader } from "@/interface/components";

export default function OrderDetailsTemplate() {


  return (
    <>
    <PageHeader title="Orders Details" ></PageHeader>
    <OrderDetails />
    </>
  )
}
