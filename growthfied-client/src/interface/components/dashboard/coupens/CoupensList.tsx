"use client";

import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Div, Typography } from "@/interface/fragments";
import { ThreeDotsIcon } from "@/interface/icons";
import { Label, CoupensListAction, TablePagination, NoData, AlertText } from "@/interface/components";
import { getCoupens } from "@/@api/dashboard/coupens.api";
import { formatDate, getCoupenStatus } from "@/utils";
import { makeUnauthorized } from "@/utils/cookie";
import OutsideClickHandler from "react-outside-click-handler";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

type CoupensListProps = {
  isFetched: boolean
  setIsFetched: Dispatch<SetStateAction<boolean>>
}

export default function CoupensList({ isFetched, setIsFetched }: CoupensListProps) {

  const searchParams = useSearchParams()
  const { update_unauthorized } = useUserStore()

  const [loading, setLoading] = useState(true)
  const [openActionItemId, setOpenActionItemId] = useState<string | null>();
  const [mobileOpenActionItemId, setMobileOpenActionItemId] = useState<string | null>();
  const [coupens, setCoupens] = useState<any>([])
  const [errorMessage, setErrorMessage] = useState<string>("empty")

  // pagination
  const currentPage = searchParams.get("p") ?? '1'
  const indexOfFirstItem = (Number(currentPage) - 1) * 8
  const indexOfLastItem = indexOfFirstItem + 8
  const entries = coupens.slice(indexOfFirstItem, indexOfLastItem)

  // fetch
  const fetchCoupens = async () => {
    try {
      const res = await getCoupens();
      setCoupens(res.data);
      setLoading(false)
    } catch (error: any) {
      if (error.response.status === 401) {
       const cookies = new Cookies();
       cookies.remove("token", { path: "/" });
       update_unauthorized()
      }
      setErrorMessage("Failed to fetch data, please retry")
    }
  }

  useEffect(() => {
    fetchCoupens();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  // action
  const handleOpenAction = (itemId: string) => {
    setOpenActionItemId(openActionItemId === itemId ? null : itemId)
  };

  const handleOutsideClick = (itemId: string) => {
    if(itemId === openActionItemId) setOpenActionItemId(null)
  }

  const handleMobileOpenAction = (itemId: string) => {
    setMobileOpenActionItemId(openActionItemId === itemId ? null : itemId)
  };

  const handleMobileOutsideClick = (itemId: string) => {
    if(itemId === mobileOpenActionItemId) setMobileOpenActionItemId(null)
  }

  return (
    <Div className="mt-5 w-full rounded-theme shadow-sm">
      <Div className="w-full h-[2.3rem] border rounded-t-theme bg-[#f5f5f5] uppercase hidden md:flex items-center">
        <Div className="w-[20%] text-center">
          <Typography className="text-[11px] font-semibold">Code</Typography>
        </Div>
        <Div className="w-[20%] text-center">
          <Typography className="text-[11px] font-semibold">Type</Typography>
        </Div>
        <Div className="w-[20%] text-center">
          <Typography className="text-[11px] font-semibold">Offer</Typography>
        </Div>
        <Div className="w-[20%] text-center">
          <Typography className="text-[11px] font-semibold">Used</Typography>
        </Div>
        <Div className="w-[20%] text-center">
          <Typography className="text-[11px] font-semibold">Status</Typography>
        </Div>
        <Div className="w-[20%] text-center">
          <Typography className="text-[11px] font-semibold">End Date</Typography>
        </Div>
        <Div className="w-[20%] text-center">
          <Typography className="text-[11px] font-semibold">Action</Typography>
        </Div>
      </Div>

      { errorMessage !== "empty" && 
        <Div className="flex justify-center" >
        <AlertText variant="danger" text={errorMessage} className="mt-[2rem] !h-[2rem]" >
        <Button className="!bg-red-500 !h-[2rem]" onClick={()=> setIsFetched(prev=> !prev)} >Refetch</Button>
        </AlertText>
        </Div>
      }

      { coupens?.length === 0 && loading === false && (
        <NoData 
         title="Your Coupens List is Empty"
         description="Let's start adding some discount coupens! Begin by clicking on the 'Create Coupen' button."
        /> 
      )}

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

      {/* pc */}
      <Div className="hidden md:flex flex-col">
        {entries?.map((data: any) => {
          const status = getCoupenStatus(data?.end_date, data?.used, data?.count)
          return(
          <Div key={data?._id} className="w-full min-h-[2.9rem] border border-transparent border-b border-b-gray-200 flex items-center bg-white cursor-pointer hover:border">
           <Div className="w-[20%] text-center hover:underline">
            <Typography className="text-[11px]" >{data?.coupen_code}</Typography>
           </Div>
           <Div className="w-[20%] text-center">
            <Typography className="text-[11px]">{data?.discount?.type === "fixed" ? "Fixed Amount" : "Percentage"}</Typography>
           </Div>
           <Div className="w-[20%] text-center">
            <Typography className="text-[11px]">
              {data?.discount?.type === "fixed" ? `₹${data?.discount?.value}` : `${data?.discount?.value}%`}
            </Typography>
           </Div>
           <Div className="w-[20%] text-center">
            <Typography className="text-[11px]">{data?.used}</Typography>
           </Div>
           <Div className="w-[20%] text-center">
           <Div className="flex justify-center" >
            <Label title={status} className={`bg-green-200 ${status === "Expired" && "!bg-yellow-200 !text-yellow-600"} ${status === "Completed" && "!bg-yellow-200"} ${ status === "Running" && "text-green-600"}`} />
           </Div>
           </Div>
           <Div className="w-[20%] text-center">
            <Typography className="text-[11px]">{formatDate(data?.end_date)}</Typography>
           </Div>
           <Div className="relative w-[20%] hidden md:flex justify-center items-center">
            <OutsideClickHandler onOutsideClick={() => handleOutsideClick(data?._id)}>
            <Div onClick={() => handleOpenAction(data?._id)} className="flex items-center justify-center hover:bg-gray-100 w-[2rem] h-[1.5rem] rounded-[3px]">
                <ThreeDotsIcon />
            </Div>
             {openActionItemId === data?._id && (
              <CoupensListAction 
                handleMobileOutsideClick={handleMobileOpenAction}
                handleOutsideClick={handleOutsideClick}
                setIsFetched={setIsFetched}
                data={data}
                className="!right-[80px]"
              />
             )}
            </OutsideClickHandler>
            </Div>
          </Div>
          )
        })}
      </Div>

      {/* mobile */}
      <Div className="flex flex-col gap-4 md:hidden">
        {entries?.map((data: any) => {
          const status = getCoupenStatus(data?.end_date, data?.used, data?.count)
          return(
          <Div key={data?._id} className="w-full min-h-[2.5rem] pb-3 border border-transparent rounded pt-[5px] flex flex-col px-4 relative bg-white">
           <Div className="w-[80%]">
            <Typography className="text-[13px] font-medium" >Code: {data?.coupen_code}</Typography>
           </Div>

          <Div className="mt-2 flex items-center justify-between flex-wrap gap-1" >
           <Div className="flex gap-1 mt-1" >
            <Typography className="text-[11px]" >Type:</Typography>
            <Typography className="text-[11px]">{data?.discount?.type === "fixed" ? "Fixed Amount" : "Percentage"}</Typography>
           </Div>
           <Div className="flex gap-1 mt-1" >
            <Typography className="text-[11px]" >OFFER:</Typography>
            <Typography className="text-[11px]">{data?.discount?.type === "fixed" ? `₹${data?.discount?.value}` : `${data?.discount?.value}%`}</Typography>
           </Div>
          </Div>

          <Div className="mt-2 flex items-center justify-between flex-wrap gap-1" >
          <Div className="flex gap-2 mt-1" >
            <Typography className="text-[12px]" >Used:</Typography>
            <Typography className="text-[12px]">{data?.used}</Typography>
           </Div>
          <Div className="flex mt-1 gap-1" >
            <Typography className="text-[11px]" >Order Status :</Typography>
            <Label title={status} className={`bg-green-200 ${status === "Expired" ? "!bg-yellow-200 !text-yellow-600" : "text-green-600"}`} />
          </Div>
          </Div>

          <Div className="mt-2 flex items-center  justify-between flex-wrap gap-1" >
          <Div className="flex gap-1 mt-1" >
            <Typography className="text-[11px]" >End Date :</Typography>
            <Typography className="text-[11px]">{formatDate(data?.end_date)}</Typography>
           </Div>
          </Div>

          <Div className="absolute !z-40 right-[5px] top-[8px] flex md:hidden">
            <OutsideClickHandler onOutsideClick={() => handleMobileOutsideClick(data?._id)}>
              <Div
                onClick={() => handleMobileOpenAction(data?._id)}
                className="flex items-center justify-center hover:bg-gray-100 w-[2rem] h-[1.5rem] rounded-[3px]"
              >
                <ThreeDotsIcon />
              </Div>
              {mobileOpenActionItemId === data?._id && (
                <CoupensListAction
                  handleMobileOutsideClick={handleMobileOpenAction}
                  handleOutsideClick={handleOutsideClick}
                  setIsFetched={setIsFetched}
                  data={data}                
                 />
              )}
            </OutsideClickHandler>
          </Div>
          </Div>
          )
        } )}
      </Div>
      <TablePagination 
        className="mt-2 md:mt-0"
        itemsPerPage={8}
        totalItems={coupens.length}
        currentPage={Number(currentPage)}
       />

    </Div>
  );
}
