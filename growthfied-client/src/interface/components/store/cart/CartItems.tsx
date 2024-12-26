"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Div, PlainButton, Span, Typography } from "@/interface/fragments";
import { DeleteIcon, TickIcon, } from "@/interface/icons";
import { DeleteConfirmPopup, QuanitySelect, RemoveConfirmPopup } from "@/interface/components";;
import { useCartStore } from "@/zustand/store/cartStore";
import { CartItem } from "@/types/store/cart";

export default function ProductsList() {

  const { items, remove_from_cart } = useCartStore();
  const [confirmPopupOpen, setConfirmOpen] = useState(false)
  const [id, setId] = useState<string>("")
  const [productTitle, setProductTitle] = useState("")

  const handleRemove = () => {
    remove_from_cart(id)
    const storedItems = localStorage.getItem("cartItems")
    if(storedItems){
      const prevItems = JSON.parse(storedItems);
      localStorage.setItem("cartItems", JSON.stringify(prevItems.filter((item: CartItem) => item.id !== id)))
    }
  }

  return (
    <>
    <RemoveConfirmPopup 
      loading={false}
      onClose={() => setConfirmOpen(false)}
      open={confirmPopupOpen}
      onSubmit={() => handleRemove()}
      product={productTitle}
      title="Product"
      type="remove"
    />
    <Div className="mt-5 w-[100%] rounded-theme shadow-sm">
      <Div className="w-full h-[2.3rem] border border-b-none rounded-t-theme bg-[#f5f5f5] uppercase hidden md:flex items-center px-6 ">
        <Div className="w-[35%] text-center">
          <Typography className="text-[11px] font-semibold">
            Product
          </Typography>
        </Div>
        <Div className="w-[21%] text-center">
          <Typography className="text-[11px] font-semibold">Quantity</Typography>
        </Div>
        <Div className="w-[21%] text-center">
          <Typography className="text-[11px] font-semibold">Price</Typography>
        </Div>
        <Div className="w-[21%] text-center">
          <Typography className="text-[11px] font-semibold">Remove</Typography>
        </Div>
      </Div>

      {/* pc */}
      <Div className="hidden md:flex flex-col">
        {items.map((data) => (
          <Div key={data.id} className="w-full min-h-[2.5rem] border flex items-center px-6 bg-white">
           <Div className="w-[35%] text-center py-2">
            <Div className="flex items-center gap-3" >
            <Image width={150} height={150} src={data.image} className="object-cover w-[4.3rem] rounded-md" alt="img" />
              <Div className="flex flex-col w-full" >
                <Link href={`/product/${data.url}`} >
                 <Typography className="text-[13px] cursor-pointer hover:underline">
                 {data?.title}
                 </Typography>
                </Link>
               {data?.variant.variant_name !== "" && (
                <Typography className="text-[10px] text-gray-400" >
                 <Span className="font-semibold" >{data?.variant.variant_name}</Span> :  {data?.variant.selected_option}
                </Typography>
               )}
               {data?.additional_message.allow && data?.additional_message.message !== "" && (
                <Typography className="text-[10px] text-gray-400" >
                 <Span className="font-semibold" >{data?.additional_message.label}</Span> : {data?.additional_message.message}
                </Typography>
               )}
              { data?.customer_photos.image_one && (
               <Div className="flex items-center justify-center text-[10px] text-gray-400 font-semibold" >
                Photos Uploaded <TickIcon className="w-[15px]" />
               </Div>
              )}
              </Div>
            </Div>
           </Div>
           <Div className="w-[21%] text-center flex items-center justify-center">
            <QuanitySelect 
              id={data.id} 
              limit_per_order={data?.limit_per_order} 
              quanity={data?.quantity} 
              className="!h-[1.8rem]"
              stocks={data?.stocks}
              variants={data?.variant}
              variants_for_quanity={data?.variants_for_quanity}
            />
           </Div>
           <Div className="w-[21%] text-center flex justify-center items-center  flex-col">
            { data.original_price > data.selling_price && (
              <Typography className="text-[12px] line-through text-gray-500">₹{data?.original_price}</Typography>
            )}
            <Typography className="text-[16px] mt-[-5px]">₹{Math.trunc(data?.selling_price)}</Typography>
           </Div>
           <Div className="w-[21%] flex items-center justify-center">
            <Div onClick={()=> {
              setId(data?.id)
              setProductTitle(data.title)
              setConfirmOpen(true)
            }} className="flex cursor-pointer items-center justify-center hover:bg-gray-100 w-[2rem] h-[1.5rem] rounded-[3px]">
              <DeleteIcon  />
            </Div>
           </Div>
          </Div>
        ))}
      </Div>

      {/* mobile */}
      <Div className="flex flex-col gap-4 md:hidden border">
        {items.map((data) => (
          <Div key={data.id} className="border border-transparent w-full min-h-[2.5rem] pb-3 rounded flex flex-col px-6 relative bg-white">
           <Div className="w-[90%] hover:underline">
            <Div className="flex items-center gap-3 mt-3">
              <Image width={100} height={100} src={data.image} className="object-cover w-[4rem] rounded-md" alt="img" />
              <Link href={`/product/${data.url}`} >
               <Typography className="text-[12px] font-medium cursor-pointer">
                {data.title}
               </Typography>
              </Link>
            </Div>
            {data?.variant.variant_name !=="" && (
                <Typography className="text-[11px] text-gray-400 mt-1" >
                <Span className="font-semibold" >{data?.variant.variant_name}</Span> :  {data?.variant.selected_option}
               </Typography>
            )}
            {data?.additional_message.allow && data?.additional_message.message !== "" && (
              <Typography className="text-[10px] text-gray-400" >
                <Span className="font-semibold" >{data?.additional_message.label}</Span> : {data?.additional_message.message}
              </Typography>
            )}
            { data?.customer_photos.image_one && (
              <Div className="flex items-center text-[10px] text-gray-400 font-semibold" >
                Photos Uploaded <TickIcon className="w-[15px]" />
              </Div>
            )}
           </Div>

           <Div className="flex items-center gap-2 mt-2" >
            <Typography className="text-xs" >Quantity :</Typography>
            <Div className="w-[60%]" >
            <QuanitySelect 
              id={data.id} 
              limit_per_order={data?.limit_per_order}  
              quanity={data.quantity} 
              className="!h-[1.9rem]"
              stocks={data.stocks}
              variants={data.variant}
              variants_for_quanity={data?.variants_for_quanity}
            />
            </Div>
           </Div>
    
           <Div className="flex items-center gap-2 mt-3" >
            <Typography className="text-[14px]" >Amount :</Typography>
            { data.original_price > data.selling_price  && (
              <Typography className="text-[12px] line-through text-gray-500">₹{data?.original_price}</Typography>
            )}
            <Typography className="text-[16px]">₹{Math.trunc(data.selling_price)}</Typography>
           </Div>

            <PlainButton onClick={() => {
              setConfirmOpen(true)
              setProductTitle(data?.title)
              setId(data?.id)
            }} className="flex items-center text-[11px] gap-[2px] mt-1 absolute right-[8px] top-[5px] hover:bg-gray-100 p-[5px] rounded-[2px]" >
             <DeleteIcon/>
            </PlainButton>
            
          </Div>
        ))}
      </Div>

    </Div>
    </>
  );
}
