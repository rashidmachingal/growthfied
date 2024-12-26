"use client"

import { Dispatch, SetStateAction } from "react";
import { Button, Div, InputField } from "@/interface/fragments";
import { Divider } from "@/interface/components";

type OrdersListFilterProps = {
  searchData:  {
    order_id: string;
    mobile_number: string;
  },
  setSearchData: Dispatch<SetStateAction<{
    order_id: string;
    mobile_number: string;
 }>>
 isSearch: boolean
 setIsSearch:  Dispatch<SetStateAction<boolean>>
 setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export default function OrdersListFilter({ searchData, setSearchData, setIsSearch, setFilterOpen }: OrdersListFilterProps) {

  const handleChange = (e: any) => {
    setSearchData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <Div className="w-[80vw] mmd:w-[20rem] bg-white rounded-theme absolute border z-[50] p-[8px] py-[16px] right-[0] top-[2.8rem] mmd:top-[2.8rem] mmd:right-0 " >
      <Div> 
        <InputField 
          type="text"
          name="order_id"
          label="Order ID" 
          placeHolder="Order ID" 
          className="mt-[2px] w-full !h-[2.2rem] bg-gray-100 text-[12px]"
          defaultValue={searchData.order_id}
          onChange={handleChange}
        />
        <Divider className="mt-2" >OR</Divider>
        <InputField
         type="number"
         name="mobile_number"
         innerText="+91"
         placeHolder="Mobile number"
         innerTextStyle="border-r pr-2 text-[13px] mt-[2px] ml-[5px]"
         className="pl-[2.5rem] w-full bg-gray-100 !h-[2.2rem] text-[12px]"
         containerStyle="mt-[10px]"
         defaultValue={searchData.mobile_number}
         onChange={handleChange}
         />

        <Div className="mt-[20px]" >
            <Button onClick={()=> { 
              setIsSearch(true)
              setFilterOpen(false)
            }} className="w-full !h-[2.2rem]" >Search Order</Button>
        </Div>

      </Div>
    </Div>
  )
}
