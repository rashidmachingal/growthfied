/* eslint-disable @next/next/no-img-element */
"use client"

import { Button, Div, Typography } from "@/interface/fragments";
import { Popup } from "@/interface/components";

type OrderImagesPopupProps = {
  customer_photos: any
  open: boolean
  onClose:  () => void
  order_id: string
}

export default function OrderImagesPopup({ open, onClose, customer_photos, order_id }: OrderImagesPopupProps) {

  const downloadImage = async (imageUrl: string, image_number: string) => {
    try {
      // Fetch the image as a blob
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();

      // Create a temporary <a> element to download the image
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${order_id}-${image_number}`; // Specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <Popup open={open} onClose={onClose}>
      <Div className="w-[95vw] lg:w-[62vw] shadow  bg-white rounded-theme p-5 pt-4">
        <Div className="flex items-center justify-between border-b pb-2">
          <Typography className="font-medium">Order Images</Typography>
        </Div>
        <Div className="flex flex-wrap justify-center gap-4 w-full mt-[15px] min-h-[5rem] max-h-[60vh] overflow-auto style-scroll">
            { customer_photos?.image_one !== null && (
              <Div className="flex flex-col w-[65%] md:w-[20%] gap-2" >
               <img className="w-full rounded-theme" src={customer_photos?.image_one} alt="" />
               <Button onClick={()=> downloadImage(customer_photos?.image_one, "image-one")} className="!h-[2rem] !bg-green-600 !text-white hover:!bg-green-500 !rounded-full" >Download</Button>
              </Div>
            )}
            { customer_photos?.image_two !== null && (
              <Div className="flex flex-col w-[65%] md:w-[20%] gap-2" >
               <img className="w-full rounded-theme" src={customer_photos?.image_two} alt="" />
               <Button onClick={()=> downloadImage(customer_photos?.image_two, "image-two")} className="!h-[2rem] !bg-green-600 !text-white hover:!bg-green-500 !rounded-full" >Download</Button>
              </Div>
            )}
            { customer_photos?.image_three !== null && (
              <Div className="flex flex-col w-[65%] md:w-[20%] gap-2" >
               <img className="w-full rounded-theme" src={customer_photos?.image_three} alt="" />
               <Button onClick={()=> downloadImage(customer_photos?.image_three, "image-three")} className="!h-[2rem] !bg-green-600 !text-white hover:!bg-green-500 !rounded-full" >Download</Button>
              </Div>
            )}
            { customer_photos?.image_four !== null && (
              <Div className="flex flex-col w-[65%] md:w-[20%] gap-2" >
               <img className="w-full rounded-theme" src={customer_photos?.image_four} alt="" />
               <Button onClick={()=> downloadImage(customer_photos?.image_four, "image-four")} className="!h-[2rem] !bg-green-600 !text-white hover:!bg-green-500 !rounded-full" >Download</Button>
              </Div>
            )}
        </Div>
        <Div className="mt-[30px] flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="!h-[2rem] w-[5rem] border-black !bg-gray-200 hover:!bg-gray-300 !text-black"
          >
            Close
          </Button>
          {/* <Button className="!h-[2rem] ">Download All</Button> */}
        </Div>
      </Div>
    </Popup>
  );
}
