"use client"

import { useRouter } from "next/navigation";
import { Div, PlainButton, Typography, VanilaSelect } from "@/interface/fragments";
import { ArrowDownIcon } from "@/interface/icons";

type TablePaginationProps = {
    itemsPerPage: number
    totalItems: number
    currentPage: number
    onPageChange?: (page: number) => void
    className?: string
    orderPagination?: boolean
    orderStatus?: string
    linesPerPage?: string
    startDate?: string
    endDate?: string
}

export default function TablePagination({ itemsPerPage, totalItems, currentPage, className, orderPagination = false, linesPerPage, orderStatus, startDate, endDate } : TablePaginationProps) {
    
    const router = useRouter()
    const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Div className={`w-full flex flex-col-reverse md:flex-row md:justify-between bg-white items-center  h-auto md:h-[2.8rem] gap-[15px] p-[15px] ${className}`}>
      <Div className='flex' >
      { orderPagination && (<Div className='flex items-center gap-2' >
       <Typography className="text-[13px]">Lines per page</Typography>
       <VanilaSelect
        className='!h-[2rem] text-[12px] !w-[6em]'
        defaultValue={linesPerPage}
        onChange={(e: any)=>{
          router.push(`?p=${currentPage}&status=${orderStatus}&lpp=${e.target.value}&start=${startDate}&end=${endDate}`)
        }}
        options={[
          {
            label: "10",
            value: "10"
          },
          {
            label: "15",
            value: "15"
          },
          {
            label: "25",
            value: "25"
          },
          {
            label: "50",
            value: "50"
          },
          {
            label: "100",
            value: "100"
          },
          {
            label: "350",
            value: "350"
          },
          {
            label: "500",
            value: "500"
          }
        ]}
       />
      </Div>)}
      </Div>

      <Div className="flex items-center gap-2" >
      { orderPagination === false && (<Div>
       <Typography className="text-[13px]">{`Page ${currentPage} of ${totalPages}`}</Typography>
      </Div>)}

      { orderPagination && (<Div>
       <Typography className="text-[13px]">{`Page ${currentPage + 1} of ${totalPages}`}</Typography>
      </Div>)}

      { orderPagination === false && (<Div className="flex items-center gap-[10px]">
        <PlainButton disabled={currentPage === 1} onClick={()=> router.push(`?p=${currentPage - 1 }`) }  className={`disabled:text-gray-500 disabled:cursor-not-allowed px-[10px] !h-[2rem]  rounded-theme flex justify-center hover:text-black items-center gap-[5px] text-[12px] border hover:bg-gray-100`}>
          <ArrowDownIcon className={`rotate-[90deg] `} />
          Prev
        </PlainButton>
        <PlainButton disabled={totalPages === currentPage} onClick={()=> router.push(`?p=${currentPage + 1 }`)} className={`disabled:text-gray-500 disabled:cursor-not-allowed px-[10px] !h-[2rem]  rounded-theme flex justify-center hover:text-black items-center gap-[5px] text-[12px] border hover:bg-gray-100`}>
           Next
          <ArrowDownIcon className={`rotate-[-90deg] `} />
        </PlainButton>
      </Div>)}   

      { orderPagination && (<Div className="flex items-center gap-[10px]">
        <PlainButton disabled={currentPage === 0} onClick={()=> {
          router.push(`?p=${currentPage - 1 }&status=${orderStatus}&lpp=${linesPerPage}&start=${startDate}&end=${endDate}`)
        } }  className={`disabled:text-gray-500 disabled:cursor-not-allowed px-[10px] !h-[2rem]  rounded-theme flex justify-center hover:text-black items-center gap-[5px] text-[12px] border hover:bg-gray-100`}>
          <ArrowDownIcon className={`rotate-[90deg] `} />
          Prev
        </PlainButton>
        <PlainButton disabled={totalPages === currentPage + 1} onClick={()=> {
          console.log("@data")
          router.push(`?p=${currentPage + 1 }&status=${orderStatus}&lpp=${linesPerPage}&start=${startDate}&end=${endDate}`)
        }} className={`disabled:text-gray-500 disabled:cursor-not-allowed px-[10px] !h-[2rem]  rounded-theme flex justify-center hover:text-black items-center gap-[5px] text-[12px] border hover:bg-gray-100`}>
           Next
          <ArrowDownIcon className={`rotate-[-90deg] `} />
        </PlainButton>
      </Div>)}   
      </Div>
         
    </Div>
  );
}


{/* 
<Div className="flex items-center gap-[5px]">
        <PlainButton disabled={currentPage === 1} onClick={() => router.push(`?p=${currentPage - 1}`)} className={`${currentPage > 1 ? "cursor-pointer" : "cursor-not-allowed"} !h-[1.7rem] !w-[3rem] rounded-theme flex justify-center hover:text-primary items-center gap-[5px] text-[12px] hover:bg-gray-200`}>
          <ArrowDownIcon className={`rotate-[90deg] ${currentPage > 1 ? "" : "fill-gray-300"}`} />
          Prev
        </PlainButton>
        <PlainButton disabled={totalPages === currentPage} onClick={() => router.push(`?p=${currentPage + 1}`)} className={`${currentPage < totalPages ? "cursor-pointer" : "cursor-not-allowed"} !h-[1.7rem] !w-[3rem] rounded-theme flex justify-center hover:text-primary items-center gap-[5px] text-[12px] hover:bg-gray-200`}>
          Next
          <ArrowDownIcon className={`rotate-[-90deg] ${currentPage < totalPages ? "" : "fill-gray-300"}`} />
        </PlainButton>
</Div> 
*/}