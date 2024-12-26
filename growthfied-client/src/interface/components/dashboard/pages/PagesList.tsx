"use client";

import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Div, Typography } from "@/interface/fragments";
import { ThreeDotsIcon } from "@/interface/icons";
import { CoupensListAction, TablePagination, NoData, AlertText, PagesListAction } from "@/interface/components";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { getPages } from "@/@api/dashboard/pages.api";

import OutsideClickHandler from "react-outside-click-handler";
import Link from "next/link";
import { DOMAIN_NAME } from "../../../../../config";
type CoupensListProps = {
  isFetched: boolean
  setIsFetched: Dispatch<SetStateAction<boolean>>
}

export default function PagesList({ isFetched, setIsFetched }: CoupensListProps) {

  const searchParams = useSearchParams()
  const { update_unauthorized, username } = useUserStore()

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
  const fetchPages = async () => {
    try {
      const res = await getPages();
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
    fetchPages();
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

  return (
    <Div className="mt-5 w-full rounded-theme shadow-sm">
      <Div className="w-full h-[2.3rem] border rounded-t-theme bg-[#f5f5f5] uppercase flex items-center">
        <Div className="w-[33.33333%] text-center">
          <Typography className="text-[11px] font-semibold">Page</Typography>
        </Div>
        <Div className="w-[33.33333%] text-center">
          <Typography className="text-[11px] font-semibold">VIEW</Typography>
        </Div>
        <Div className="w-[33.33333%] text-center">
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
         title="Your Pages is Empty"
         description="Let's start adding some pages! You can add pages like Return Policy, Terms & Condiion and More"
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
      <Div className=" flex flex-col">
        {entries?.map((data: any) => {
          return(
          <Div key={data?._id} className="w-full min-h-[2.9rem] border border-transparent border-b border-b-gray-200 flex items-center bg-white cursor-pointer hover:border">
           <Div className="w-[33.3333%] text-center hover:underline">
            <Typography className="text-[11px]" >{data?.page_title}</Typography>
           </Div>
           <Div className="w-[33.3333%] text-center">
            <Link target="_blank" href={`http://${username}.${DOMAIN_NAME}/p/${data?.slug}`} className="text-[11px] text-blue-600">/p/{data?.slug}</Link>
           </Div>
           <Div className="relative w-[33.3333%]  flex justify-center items-center">
            <OutsideClickHandler onOutsideClick={() => handleOutsideClick(data?._id)}>
            <Div onClick={() => handleOpenAction(data?._id)} className="flex items-center justify-center hover:bg-gray-100 w-[2rem] h-[1.5rem] rounded-[3px]">
                <ThreeDotsIcon />
            </Div>
             {openActionItemId === data?._id && (
              <PagesListAction 
                data={data}
                setIsFetched={setIsFetched}
                className="right-[15px] md:!right-[auto]"
              />
             )}
            </OutsideClickHandler>
            </Div>
          </Div>
          )
        })}
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
