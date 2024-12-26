"use client"

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Div, SelectDropdown, Typography } from '@/interface/fragments'
import { EditProductTypes } from '@/types/dashboard/products'

type StatusDetailsProps = {
    editProductData: EditProductTypes
    setEditProductData: Dispatch<SetStateAction<EditProductTypes>>
}

export default function StatusDetails({ editProductData, setEditProductData }: StatusDetailsProps) {

  const statusOptions = [
    {
      label: "Active",
      value: "Active",
    },
    {
      label: "Draft",
      value: "Draft",
    },
  ]

  useEffect(() => {
    setStatus({ label: editProductData.status, value: editProductData.status })
  }, [editProductData])
  
    
 const [status, setStatus] = useState({ label: editProductData.status, value: editProductData.status })
 
 const handleStatusChange = (value: any) => {
    setEditProductData((prevData) => ({
      ...prevData,
      status: value.value
    }));
  }

  return (
    <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[3px]" >
    <Div className="mt-[9px]" >
     <Typography className="text-[13px]" >Status</Typography>
     <SelectDropdown
       options={statusOptions}
       defaultValue={status}
       setDefaultValue={setStatus}
       onChange={handleStatusChange}
       className="mt-[10px]"
     />
    </Div>
   </Div>
  )
}
