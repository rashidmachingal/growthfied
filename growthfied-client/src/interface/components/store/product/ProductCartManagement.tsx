"use client";

import { useEffect, useState } from "react";
import { Div, Typography } from "@/interface/fragments";
import { CreateProductTypes } from "@/types/dashboard/products";
import { AddToCart, AlertText, QuanitySelect, UserAdditionalMessage, UserUploadImages, VariantsSelect } from "@/interface/components";
import { useCartStore } from "@/zustand/store/cartStore";
import { PhotosDataTypes } from "@/types/store/cart";

type ProductCartManagementProps = {
    product: CreateProductTypes & {
        _id?: string;
    }
}

export default function ProductCartManagement({ product }: ProductCartManagementProps) {

  const { items } = useCartStore();
  const [addedToCart, setAddedToCart] = useState(false)
  const [quantity, setQuantity] = useState<number>(product?.limit_per_order.minimum)
  const [variants, setVariants] = useState({
    variant_name: product.variants.variant_name,
    selected_option: product.variants.options.option_one
  })
  const [message, setMessage] = useState({
    allow: product.accept_message.allow,
    label: product.accept_message.label,
    message: ""
  })
  const [photosData, setPhotosData] = useState<PhotosDataTypes>({
    images: {
      image_one: "",
      image_two: "",
      image_three: "",
      image_four: "",
    },
    temporary_image_urls: {
      image_one: null,
      image_two: null,
      image_three: null,
      image_four: null,
    },
  });
  const [tempImgId, setTempImgId] = useState<any>(null);
  const [errorMessages, setErrorMessages] = useState({
    photos: false,
    message: false
  })

  useEffect(() => {
   items.forEach((item) => {
    if(item.id === product._id){
      setQuantity(item.quantity)
      setAddedToCart(true)
      setVariants({
        variant_name: product.variants.variant_name,
        selected_option: item.variant.selected_option
      })
    }
   })
   const tempimg_id = localStorage.getItem(`${"tempimg_id-" + product._id}`);
   if(tempimg_id) setTempImgId(JSON.parse(tempimg_id))
  }, [items,product._id,product.variants.variant_name])

  

  return (
    <>
        {product?.variants?.variant_name?.length !== 0 &&  (
          <Div className="mt-[15px] flex flex-col gap-1" >
           <Typography className="text-[13px] text-gray-500" >{product?.variants?.variant_name}</Typography>
           <VariantsSelect setQuantity={setQuantity} quantity={quantity} product={product} addedToCart={addedToCart} id={product._id} setVariants={setVariants} selected_variant={variants} variant_name={product?.variants?.variant_name} variants={product?.variants?.options} />
          </Div>
        )}
        {product?.accept_images?.allow && (
         <Div className="mt-[15px] flex flex-col gap-1" >
            <Typography className="text-[13px] text-gray-500" >Upload {product?.accept_images.number === 1 ? "Photo": "Photos" } (required)</Typography>
            <UserUploadImages errorMessages={errorMessages} setErrorMessages={setErrorMessages} setTempImgId={setTempImgId} id={product?._id} photosData={photosData} setPhotosData={setPhotosData}  number={product?.accept_images.number} />
         </Div>
        )}
        {product?.accept_message.allow && (
          <Div className="mt-[15px] flex flex-col gap-1" >
            <Typography className="text-[13px] text-gray-500" >{product?.accept_message.label} ({product?.accept_message.required ? "required" : "optional"})</Typography>
            <UserAdditionalMessage errorMessages={errorMessages} setErrorMessages={setErrorMessages} id={product?._id} setMessage={setMessage} />
          </Div>
        )}
      <Div className="mt-[15px] flex flex-col gap-1">
        <Typography className="text-[13px] text-gray-500">Quantity</Typography>
        <QuanitySelect 
          quanity={quantity} 
          setQuantity={setQuantity} 
          limit_per_order={product.limit_per_order}
          id={product._id}
          stocks={product.quantity}
          variants_for_quanity={product.variants}
          variants={variants}
        />
      </Div>
      <Div className="mt-[25px] flex flex-col gap-2">
        {product.variants.variant_name === "" && (
          Number(product.quantity) <= 0 && <Typography className="text-red-500 font-semibold text-[13px]" >Currently out of stocks!</Typography>
        )}

        {product.variants.variant_name !== "" && variants.selected_option == product.variants.options.option_one && product.variants.options_quantity.option_one <= 0 && (
          <Typography className="text-red-500 font-semibold text-[13px]" >{variants.selected_option} is Currently out of stocks!</Typography>
        )}
        {product.variants.variant_name !== "" && variants.selected_option == product.variants.options.option_two && product.variants.options_quantity.option_two <= 0 && (
          <Typography className="text-red-500 font-semibold text-[13px]" >{variants.selected_option} is Currently out of stocks!</Typography>
        )}
        {product.variants.variant_name !== "" && variants.selected_option == product.variants.options.option_three && product.variants.options_quantity.option_three <= 0 && (
          <Typography className="text-red-500 font-semibold text-[13px]" >{variants.selected_option} is Currently out of stocks!</Typography>
        )}
        {product.variants.variant_name !== "" && variants.selected_option == product.variants.options.option_four && product.variants.options_quantity.option_four <= 0 && (
          <Typography className="text-red-500 font-semibold text-[13px]" >{variants.selected_option} is Currently out of stocks!</Typography>
        )}

        <Div className="flex flex-col md:flex-row gap-[8px] p-0" >
        <AddToCart 
          product={product} 
          quantity={quantity}
          variants={variants}
          addedToCart={addedToCart}
          additional_message={message}
          customer_photos={photosData}
          tempimg_id={tempImgId}
          setErrorMessages={setErrorMessages}
        />
        {!addedToCart  && (
          <AddToCart 
           product={product} 
           quantity={quantity}
           variants={variants}
           addedToCart={addedToCart}
           additional_message={message}
           customer_photos={photosData}
           tempimg_id={tempImgId}
           setErrorMessages={setErrorMessages}
           buy_now
        />
        )}
        </Div>
      
        { product?.discount_based_pm?.allow && (<AlertText
         text={`
          ${
          product?.discount_based_pm.payment_method ==="cod" ? 
          "Order Through CoD": "Pay Online"} 
           & Save 
           ₹${ product.selling_price - product.discount_based_pm.selling_price}
          `}
         variant="success"
         className=" text-[12px] !h-[0.5rem]"
        />)}

      </Div>
    </>
  );
}
