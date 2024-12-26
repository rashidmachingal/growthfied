"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { Div, Section, Typography } from "@/interface/fragments";
import { Pagination, ProductCard } from "@/interface/components";
import { useParams, useSearchParams } from "next/navigation";
import { CreateProductTypes } from "@/types/dashboard/products";
import { getSearchPrdocuts } from "@/@api/store/search";
import { LoadingIcon } from "@/interface/icons";
import NoDataImage from '../../../../../public/settings/no-data.png';

export default function SearchTemplate() {

    interface ExtendedCreateProductTypes extends CreateProductTypes {
        _id: string;
    }
      
    const params = useParams()
    const searchParams = useSearchParams()

    const [ storename ] = useState(decodeURIComponent(params.username.toString()))
    const [products, setProducts] = useState<ExtendedCreateProductTypes[]>([])
    const [loading, setLoading] = useState(true)

    const fetchSearchProducts = async () => {
        const res = await 
        getSearchPrdocuts(storename.replace(/@/g, ""), searchParams.get("query"))
        setProducts(res?.data)
        setLoading(false)
    }

    useEffect(() => {
     fetchSearchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

      // pagination
     const page = searchParams.get("page") ?? '1'
     const start = (Number(page) - 1) * 12
     const end = start + 12
     const entries = products.slice(start, end)

  return (
    <Section className="flex flex-col items-center mt-[2.8rem] md:mt-[5rem] pb-[8rem] md:pb-[5rem] w-full " >
      <Div className="mt-[1rem] shadow w-[90%] md:w-[70%] h-[2.3rem] px-4 flex items-center rounded-[3px]" >
        <Typography>Showing result for: {searchParams.get("query")}</Typography>
      </Div>
    <Div className="w-full md:w-[95%] lg:w-[80%] flex justify-center gap-[1rem] md:gap-[2rem] flex-wrap mt-[2rem]" >
      {entries.map((data: any) => (
        <ProductCard key={data._id} storename={storename} data={data} />
      ))}
      {loading && ( 
        <Div className="flex items-center justify-center w-full h-[50vh]" >
         <LoadingIcon className="animate-spin !w-[2.5rem]" />
         <Typography>loading...</Typography>
        </Div>
      )}
      {products.length === 0  && loading === false && ( 
        <Div className="flex flex-col items-center justify-center w-full h-[40vh]" >
          <Image src={NoDataImage} width={180} height={180} alt="image" className="w-[8rem] h-[8rem]" />
          <Typography className="text-[18px] font-medium text-center mt-3" >Sorry, no results found!</Typography>
          <Typography className="text-center text-[13px]" >Please check the spelling or try searching for something else</Typography>
        </Div>
      )}
    </Div>
    <Div className="mt-5" >
     <Pagination  
       url={`/search?query=${searchParams.get("query")}&`}
       hasPrevPage={start > 0}
       hasNextPage={end < products.length}
       totalLength={products.length}
     />
    </Div>
  </Section>
  )
}
