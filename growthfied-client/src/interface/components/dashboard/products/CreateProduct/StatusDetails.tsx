"use client"

import { Dispatch, SetStateAction, useState } from 'react'
import { Div, SelectDropdown, Typography } from '@/interface/fragments'
import { CreateProductTypes } from '@/types/dashboard/products'

type StatusDetailsProps = {
    setProductData: Dispatch<SetStateAction<CreateProductTypes>>
}

export default function StatusDetails({ setProductData }: StatusDetailsProps) {

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
    
    
 const [status, setStatus] = useState(statusOptions[0])

 
 const handleStatusChange = (value: any) => {
    setProductData((prevData) => ({
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
