"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { Div } from "@/interface/fragments";
import { OrdersListFilter } from "@/interface/components";
import { SearchIcon } from "@/interface/icons";
import OutsideClickHandler from "react-outside-click-handler";

type OrderSearchProps = {
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
}

export default function OrderSearch({ searchData, setSearchData, isSearch, setIsSearch }: OrderSearchProps) {

  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <>
      <Div className="relative flex items-center gap-2 " >
        <OutsideClickHandler onOutsideClick={()=> setFilterOpen(false)} >
        <Div onClick={()=> setFilterOpen(prev=> !prev) } className={`${filterOpen && 'glowing-border-select'} flex justify-center items-center bg-white border h-theme w-[2.5rem] rounded-theme gap-1 cursor-pointer`} >
         <SearchIcon/>
        </Div>
        { filterOpen && (
          <OrdersListFilter
           isSearch={isSearch}
           setIsSearch={setIsSearch}
           searchData={searchData}
           setSearchData={setSearchData}
           setFilterOpen={setFilterOpen}
          />
        )}
        </OutsideClickHandler>
       </Div>
    </>
  )
}
