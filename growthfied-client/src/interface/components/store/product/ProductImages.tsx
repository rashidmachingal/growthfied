"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { Div } from "@/interface/fragments";
import { BACKEND_URL } from "../../../../../config";
import DemoImage from '../../../../../public/settings/no-product.webp'

type ProductImagesProps = {
    images: any
}

export default function   ProductImages({ images }: ProductImagesProps) {

  const imagesArray = [
    {  url: images?.image_one === "no_image" ? DemoImage.src :
    `${BACKEND_URL}/public/images/products/${images?.image_one}`
    },
    {  url: images?.image_two === "no_image" ? DemoImage.src :
    `${BACKEND_URL}/public/images/products/${images?.image_two}`
    },
    {  url: images?.image_three === "no_image" ? DemoImage.src :
    `${BACKEND_URL}/public/images/products/${images?.image_three}`
    },
   ]


    const [activeImage, setActiveImage] = useState(0)
    const [imageCount, setImageCount] = useState(0)

    useEffect(() => {
      if(imagesArray[0].url !== DemoImage.src){
        setActiveImage(0)
      }else{
        if(imagesArray[1].url !== DemoImage.src){
          setActiveImage(1)
        }else{
          if(imagesArray[2].url !== DemoImage.src){
            setActiveImage(2)
          }
        }
      }

      const count = imagesArray.filter(data => data.url !== DemoImage.src).length;
      setImageCount(count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    
  return (
    <Div className="w-full flex flex-col" >
    <Div className="flex justify-center md:justify-end " >
      <Div className="w-[90%] xm:w-[370px] h-[390px]  shadow-lg rounded-theme flex items-center overflow-hidden border bg-white md:border-transparent" >
        <Image
         width={450}
         height={450}
         alt="product image"
         className="border transition-all object-contain object-center shadow rounded-theme"
         src={`${imagesArray[activeImage]?.url}`}
        />
      </Div>
    </Div>
    {imageCount !== 1 && 
     (<Div className="flex justify-center md:justify-end mt-[18px]" >
        <Div className="w-[90%] xm:w-[370px] h-[90px] flex justify-center gap-[18px] px-[10px] md:px-[2rem]" >
          {imagesArray.map((data, index) => {
            if(data.url !== DemoImage.src){
              return(
                <Div onClick={()=> setActiveImage(index)} key={index} className={`cursor-pointer border-2 ${activeImage === index && 'border-black' } rounded-theme w-[25.333%] h-full flex items-center overflow-hidden`} >
                 <Image width={250} height={250} src={`${data.url}`} className="object-cover" alt="img" />
                </Div>
              )
            }else{
              null
            }
          })}
        </Div>
    </Div>)}
    </Div>
  )
}
