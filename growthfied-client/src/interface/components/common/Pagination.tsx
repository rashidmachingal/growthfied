"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { Button, Div } from "@/interface/fragments";
import { ArrowDownIcon } from "@/interface/icons";

type PaginationProps = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalLength: number
  url: string
}

export default function Pagination({ hasPrevPage, hasNextPage, totalLength, url }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const totalPages = Math.ceil(totalLength / 12);
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
      endPage = Math.min(maxPagesToShow, totalPages);
    } else {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }
  }

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage);

  return (
    <Div className="flex items-center gap-3 cursor-pointer py-1 px-1 rounded-[5px]" >
      {hasPrevPage && (
        <Div
          onClick={() => router.push(`${url}page=${currentPage - 1}`)}
          className="h-[2rem] rounded-theme w-[2rem] flex justify-center items-center gap-[5px] text-[12px] hover:bg-gray-200"
        >
          <ArrowDownIcon className="rotate-[90deg]" />
        </Div>
      )}

      {pageNumbers.map((page) => (
        <Button
          key={page}
          className={`hover:!ring-4 !outline-none  !ring-[#d3d3d39e] !h-[1.3rem] !w-[1.3rem] !bg-transparent flex items-center justify-center !rounded-theme !text-[12px] !text-primary 
          ${page === currentPage && "!bg-gray-200 !ring-[#d3d3d39e] !ring-4"}`}
          onClick={() => router.push(`${url}page=${page}`)}
        >
          {page}
        </Button>
      ))}

      {hasNextPage && (
        <Div
          onClick={() => router.push(`${url}page=${currentPage + 1}`)}
          className="h-[2rem] rounded-theme w-[2rem] flex justify-center items-center gap-[5px] text-[12px] hover:bg-gray-200"
        >
          <ArrowDownIcon className="rotate-[-90deg]" />
        </Div>
      )}
    </Div>
  );
}


