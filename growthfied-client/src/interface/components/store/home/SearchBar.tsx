"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Button, Div, Form, InputField, PlainButton, Typography } from "@/interface/fragments";
import { CloseButtonIcon, CloseIcon, LoadingIcon, SearchIcon } from "@/interface/icons";

type SearchBarProps = {
  className?: string
}

export default function SearchBar({ className }: SearchBarProps) {

    const searchParams = useSearchParams()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    }

    const handleSearch = async (e: any) => {
      e.preventDefault();
      setLoading(true)
      if (searchQuery === "" || !/[a-zA-Z]/.test(searchQuery)) return;
      try {
        setLoading(true);
        router.push(`/search?query=${searchQuery}`);
      } finally {
        setLoading(false);
        setOpen(false)
      }
    };
    
    
    return (
      <>
      <PlainButton onClick={()=> setOpen(prevData => !prevData)} >
      <SearchIcon className="cursor-pointer h-[1.4rem] w-[1.4rem] md:!h-[1.5rem] md:!w-[1.5rem]" />
      </PlainButton>
      { open && (
        <Div className="absolute w-[100%] top-[0rem] left-0 flex flex-col items-center justify-center z-[100] overflow-hidden" >
         <Div className="shadow bg-white w-full h-[8rem] border flex items-center justify-center" >
         <Div className={`w-full top-0 md:w-auto mt-[rem] flex flex-col md:mt-0 ${className} px-[5px]`} >
         <Form onSubmit={handleSearch} className="w-full flex justify-center gap-2 items-center" >
         <InputField defaultValue={searchParams.get("query")?.toString()} onChange={handleChange} type="search" placeHolder="Search" containerStyle="w-[75%] md:w-[30rem]" className="border bg-gray-100 text-[14px] w-full !h-[2.3rem]" />
         <PlainButton onClick={handleSearch} className="cursor-pointer !h-[2.3rem] w-[3rem] bg-[#252424] hover:bg-black flex items-center justify-center rounded-theme" >
            { loading ? <LoadingIcon className="animate-spin !stroke-white" /> : <SearchIcon className="stroke-white" />}
         </PlainButton>
       
         </Form>
         <PlainButton className="flex items-center justify-center mt-3"  onClick={()=> setOpen(prevData => !prevData)} >
         <CloseButtonIcon className="!w-[1.5rem] !h-[1.5rem] stroke-gray-500 cursor-pointer hover:stroke-gray-600" />
         </PlainButton>
         </Div>

         </Div>
         <Div onClick={()=> setOpen(prevData => !prevData)} className="w-full h-screen bg-[#050202ab] flex justify-center relative" >

         </Div>
        </Div>
    )}
      </>
    )
  
}
