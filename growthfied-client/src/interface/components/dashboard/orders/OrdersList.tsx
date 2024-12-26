"use client";

import { Button, Div, Span, Typography } from "@/interface/fragments";
import { AlertText, Label, NoData, OrderBarFilter, OrderDate, OrderSearch, TablePagination } from "@/interface/components";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { getOrders } from "@/@api/dashboard/orders.api";
import { formatDateDDMMYYYY, formatOrderDate } from "@/utils";
import Cookies from "universal-cookie";

type OrderListProps = {
  reFetch: boolean
  setReLoading: Dispatch<SetStateAction<boolean>>
}

export default function OrdersList({ reFetch, setReLoading }: OrderListProps) {

  const router = useRouter()
  const searchParams = useSearchParams()
  const { update_unauthorized } = useUserStore()

  const [orders, setOrders] = useState<any>([])
  const [totalItems, setTotalItems] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [isSearch, setIsSearch] = useState(false)
  const [searchData, setSearchData] = useState({
    order_id: "",
    mobile_number: ""
  })

  // pagination & order status
  const currentPage = searchParams.get("p") ?? '0'
  const linesPerPage = searchParams.get("lpp") ?? '10'
  const orderStatus = searchParams.get("status") ?? 'Processing'
  const startDate = searchParams.get("start") ?? '2020-01-01'
  const endDate = searchParams.get("end") ?? formatOrderDate(new Date);

  // fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = {
        page_index: currentPage,
        page_size: linesPerPage,
        start_date: startDate,
        end_date: endDate,
        order_status: orderStatus,
        mobile_number: searchData.mobile_number,
        order_id: searchData.order_id
      }
      const res = await getOrders(params);
      setOrders(res.data.orders);
      setTotalItems(res.data.totalRecords)
      setLoading(false)
      setReLoading(false)
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
       }
       setErrorMessage("Failed to fetch data, please retry")
       setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, linesPerPage, orderStatus, startDate, endDate, isSearch, reFetch]);

  return (
    <>
      <Div className="overflow-hidden border mt-[1rem] bg-white rounded-[5px]">
        <OrderBarFilter
         currentPage={currentPage}
         linesPerPage={linesPerPage}
         orderStatus={orderStatus}
         startDate={startDate}
         endDate={endDate}
        />

        <Div className="w-full flex justify-between mt-[8px] px-[10px]" >
          { isSearch === false && <Span></Span>}
          { isSearch && <Button onClick={()=> {
            setIsSearch(false)
            setSearchData({
              order_id: "",
              mobile_number: ""
            })
          }} className="!rounded-full !bg-yellow-500 !h-[2rem]" >Clear Search</Button>}
        <Div className="flex justify-end items-center gap-[8px]">
          <OrderSearch
           isSearch={isSearch}
           setIsSearch={setIsSearch}
           searchData={searchData}
           setSearchData={setSearchData}
          />
          <OrderDate
           currentPage={Number(currentPage)}
           linesPerPage={linesPerPage}
           orderStatus={orderStatus}
          />
        </Div>
        </Div>

        

        <Div className="overflow-x-auto" >

        <Div className="min-w-[75rem] h-[2.3rem] mt-2 border rounded-t-theme bg-[#f5f5f5] uppercase flex items-center">
        <Div className="min-w-[12rem] text-center">
          <Typography className="text-[11px] font-semibold">Order Id</Typography>
        </Div>
        <Div className="min-w-[12rem] text-center">
          <Typography className="text-[11px] font-semibold">Date</Typography>
        </Div>
        <Div className="min-w-[12rem] text-center">
          <Typography className="text-[11px] font-semibold">Customer</Typography>
        </Div>
        <Div className="min-w-[10rem] text-center">
          <Typography className="text-[11px] font-semibold">Payment Method</Typography>
        </Div>
        <Div className="min-w-[5rem] text-center">
          <Typography className="text-[11px] font-semibold">Items</Typography>
        </Div>
        <Div className="min-w-[12rem] text-center">
          <Typography className="text-[11px] font-semibold">Amount</Typography>
        </Div>
        <Div className="min-w-[12rem] text-center">
          <Typography className="text-[11px] font-semibold">Order Status</Typography>
        </Div>
      </Div>

      <Div className="min-w-[75rem] w-full flex flex-col">
        {orders?.map((data:any) => (
          <Div key={data?._id} onClick={()=> router.push(`/dashboard/orders/${data?._id}`)} className="w-full min-h-[2.9rem] border border-transparent cursor-pointer border-b border-b-gray-200 flex items-center bg-white hover:border-primary hover:border">
          <Div className="min-w-[12rem] text-center">
            <Typography className="text-[11px]" >{data?.order_id}</Typography>
          </Div>
          <Div className="min-w-[12rem] text-center">
            <Typography className="text-[11px]">{formatDateDDMMYYYY(data?.order_date)} <Span className="text-[10px]" >{data?.order_time}</Span></Typography>
          </Div>
          <Div className="min-w-[12rem] text-center">
            <Div className="flex flex-col" >
            <Typography className="text-[11px]">{data?.shipping_address?.full_name}</Typography>
            </Div>
          </Div>
          <Div className="min-w-[10rem] text-center">
            <Typography className="text-[11px]">{data?.payment_method === "cod" ? "COD" : "Online"}</Typography>
          </Div>
          <Div className="min-w-[5rem] text-center">
            <Typography className="text-[11px]">{data?.items.length}</Typography>
          </Div>
          <Div className="min-w-[12rem] text-center">
            <Typography className="text-[11px]">₹{data?.price_details?.net_total}</Typography>
          </Div>
          <Div className="min-w-[12rem] flex items-center justify-center">
            <Label title={data?.order_last_status} className={`
              ${data?.order_last_status === "Processing" && "bg-yellow-200 text-yellow-600"} 
              ${data?.order_last_status === "Shipped" && "bg-green-200 text-green-600"} 
              ${data?.order_last_status === "Completed" && "bg-green-200 text-green-600"} 
              ${data?.order_last_status === "Cancelled" && "bg-red-200 text-red-600"} 
              ${data?.order_last_status !== "Cancelled" && data?.order_last_status !== "Completed" && data?.order_last_status !== "Shipped" && data?.order_last_status !== "Processing" && "bg-green-200 text-green-600"} 
              px-2`
            } 
            />
          </Div>
        </Div>
        ))}
      </Div>
      
        </Div>


       {/* skelton */}
       {loading && (
        <Div className="w-full bg-white p-[9px] pt-[8px] flex flex-col gap-[15px] pb-[3rem]" >
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
      </Div>
      )}

     {orders?.length === 0 && loading === false && errorMessage === "empty" && (
        <NoData 
         title="No orders found!"
         description=""
        /> 
      )}

      { errorMessage !== "empty" && 
        <Div className="flex justify-center" >
        <AlertText variant="danger" text={errorMessage} className="mt-[2rem] !h-[2rem]" >
        <Button className="!bg-red-500 !h-[2rem]" onClick={()=> { location.reload() }} >Refetch</Button>
        </AlertText>
        </Div>
      }

        <TablePagination 
         className="mt-2 md:mt-0 border-t"
         itemsPerPage={10}
         totalItems={totalItems}
         currentPage={Number(currentPage)}
         orderPagination
         linesPerPage={linesPerPage}
         orderStatus={orderStatus}
         startDate={startDate}
         endDate={endDate}
        />
      </Div>
    </>
  );
}
