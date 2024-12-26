import { Div, PlainButton } from "@/interface/fragments";
import { useRouter } from "next/navigation";

type OrderBarFilterProps = {
  currentPage: string
  linesPerPage: string
  orderStatus: string
  startDate: string
  endDate: string
}

export default function OrderBarFilter({ orderStatus, linesPerPage, currentPage, startDate, endDate }: OrderBarFilterProps) {

  const router = useRouter()

  return (
    <>
    <Div className="flex items-center gap-[25px] h-[2.8rem] border-b px-[15px] overflow-auto" >
      <Div onClick={()=> router.push(`?p=${currentPage}&status=Processing&lpp=${linesPerPage}&start=${startDate}&end=${endDate}`)} className={`${orderStatus === "Processing" ? 'border-b-black font-[600]' : 'border-b-transparent text-gray-500 font-[500]'} border-b-[2px] h-full flex text-[14px] w-[4.5rem] justify-center`} >
        <PlainButton>Processing</PlainButton>
      </Div>
      <Div onClick={()=> router.push(`?p=${currentPage}&status=Shipped&lpp=${linesPerPage}&start=${startDate}&end=${endDate}`)} className={`${orderStatus === "Shipped" ? 'border-b-black font-[600]' : 'border-b-transparent text-gray-500 font-[500]'} border-b-[2px] h-full flex text-[14px] w-[4rem] justify-center`} >
        <PlainButton>Shipped</PlainButton>
      </Div>
      <Div onClick={()=> router.push(`?p=${currentPage}&status=Completed&lpp=${linesPerPage}&start=${startDate}&end=${endDate}`)} className={`${orderStatus === "Completed" ? 'border-b-black font-[600]' : 'border-b-transparent text-gray-500 font-[500]'} border-b-[2px] h-full flex text-[14px] w-[4rem] justify-center`} >
        <PlainButton>Completed</PlainButton>
      </Div>
      <Div onClick={()=> router.push(`?p=${currentPage}&status=Cancelled&lpp=${linesPerPage}&start=${startDate}&end=${endDate}`)} className={`${orderStatus === "Cancelled" ? 'border-b-black font-[600]' : 'border-b-transparent text-gray-500 font-[500]'} border-b-[2px] h-full flex text-[14px] w-[4rem] justify-center`} >
        <PlainButton>Cancelled</PlainButton>
      </Div>
      <Div onClick={()=> router.push(`?p=${currentPage}&status=All&lpp=${linesPerPage}&start=${startDate}&end=${endDate}`)} className={`${orderStatus === "All" ? 'border-b-black font-[600]' : 'border-b-transparent text-gray-500 font-[500]'} border-b-[2px] h-full flex text-[14px] w-[2rem] justify-center`} >
        <PlainButton>All</PlainButton>
      </Div>
    </Div>
    </>
  )
}
