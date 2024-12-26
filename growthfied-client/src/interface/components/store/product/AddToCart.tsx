"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/interface/fragments";
import { AddToCartIcon, AddedToCart, ExclamationIcon, LoadingIcon } from "@/interface/icons";
import { CreateProductTypes } from "@/types/dashboard/products";
import { getProductThumbnail } from "@/utils";
import { useCartStore } from "@/zustand/store/cartStore";
import { toast } from "sonner";
import { PhotosDataTypes } from "@/types/store/cart";

type VariantType = {
    variant_name: string;
    selected_option: string;
}

type MessageType = {
    allow: boolean;
    label: string;
    message: string;
}

type AddToCartProps = {
  product: CreateProductTypes & {
    _id?: string;
  }
  quantity: number
  variants: VariantType
  addedToCart: boolean
  additional_message: MessageType
  customer_photos: PhotosDataTypes
  tempimg_id: any
  setErrorMessages: Dispatch<SetStateAction<{
    photos: boolean;
    message: boolean;
  }>>
  buy_now?: boolean
}

export default function AddToCart({ product, quantity, variants, addedToCart, additional_message, customer_photos, tempimg_id, setErrorMessages, buy_now }: AddToCartProps) {

  const router = useRouter()
  const { add_to_cart } = useCartStore()

  const [loading, setLoading] = useState(false)
  const [firstTimeAdd, setFirstTimeAdd] = useState(false)

  const handleRedirectToCart = () => {
    setLoading(true)
    if(buy_now){
      router.push(`/checkout`)
    }else{
      router.push(`/cart`)
    }
  }

  const handleAddToCart = () => {
    if (!product?._id)  return;

    if(product.variants.variant_name !== ""){
      if(variants.selected_option === product.variants.options.option_one && product.variants.options_quantity.option_one <= 0){
        return (
          toast.error(`${variants.selected_option} is currently out of stock!`,
            { icon: <ExclamationIcon className="!fill-yellow-500" /> })
        )
      }
      if(variants.selected_option === product.variants.options.option_two && product.variants.options_quantity.option_two <= 0){
        return (
          toast.error(`${variants.selected_option} is currently out of stock!`,
            { icon: <ExclamationIcon className="!fill-yellow-500" /> })
        )
      }
      if(variants.selected_option === product.variants.options.option_two && product.variants.options_quantity.option_two <= 0){
        return (
          toast.error(`${variants.selected_option} is currently out of stock!`,
            { icon: <ExclamationIcon className="!fill-yellow-500" /> })
        )
      }
      if(variants.selected_option === product.variants.options.option_three && product.variants.options_quantity.option_three <= 0){
        return (
          toast.error(`${variants.selected_option} is currently out of stock!`,
            { icon: <ExclamationIcon className="!fill-yellow-500" /> })
        )
      }
      if(variants.selected_option === product.variants.options.option_four && product.variants.options_quantity.option_four <= 0){
        return (
          toast.error(`${variants.selected_option} is currently out of stock!`,
            { icon: <ExclamationIcon className="!fill-yellow-500" /> })
        )
      }
    }

    if(product.variants.variant_name === ""){
      if(product.quantity !== "unlimited"){
        if(Number(product.quantity) <= 0){
          return toast.error(`This product is currently out of stock!`,
            { icon: <ExclamationIcon className="!fill-yellow-500" /> }) 
        }
      }
    }

    if(product.accept_images.allow && tempimg_id === null){
      setErrorMessages((prevData => ({
        ...prevData,
        photos: true
      })))
      return toast.error(`Please Upload ${product.accept_images.number === 1 ? "Image!" : "Images"}`,
      { icon: <ExclamationIcon className="!fill-yellow-500" /> })
    }

    if(product.accept_message.required && additional_message.message === ""){
      setErrorMessages((prevData => ({
        ...prevData,
        message: true
      })))
      return toast.error(`Please fill ${additional_message.label}`,
      { icon: <ExclamationIcon className="!fill-yellow-500" /> })
    }

    setErrorMessages({
      photos: false,
      message: false
    })

    const productData = {
      id: product._id,
      url: product.slug,
      title: product.title,
      image: getProductThumbnail(product),
      quantity: quantity,
      selling_price: product?.selling_price,
      variant: variants,
      original_price: product?.original_price,
      limit_per_order: {
        minimum: product?.limit_per_order.minimum,
        maximum: product?.limit_per_order.maximum
      },
      additional_message: additional_message,
      customer_photos: customer_photos.temporary_image_urls,
      tempimg_id: tempimg_id,
      stocks: product.quantity,
      delivery_charge: product?.delivery_charge,
      delivery_days: product?.delivery_days,
      payment_method: product?.payment_methods,
      variants_for_quanity: product?.variants,
      discount_based_pm: {
        allow: product?.discount_based_pm?.allow,
        payment_method: product?.discount_based_pm?.payment_method,
        selling_price: product?.discount_based_pm?.selling_price,
      }
    }
    
    add_to_cart(productData);
    setFirstTimeAdd(true)
    
    const storedItems = localStorage.getItem("cartItems")
    if(storedItems){
      const prevItems = JSON.parse(storedItems);
      prevItems.push(productData)
      localStorage.setItem("cartItems", JSON.stringify(prevItems))
    }else{
      localStorage.setItem("cartItems", JSON.stringify([productData]))
    }

    handleRedirectToCart()
  };
  

  return (
    <>
    { addedToCart ? (
     <Button onClick={handleRedirectToCart} className="w-full mmd:w-[60%] gap-3 !bg-gray-400" >
      { firstTimeAdd ? <LoadingIcon className="animate-spin"/> : (
        <>
        GO TO CART
        <AddedToCart/>
        </>
      )}
      </Button>
    ) : 
     (<Button
      onClick={handleAddToCart}
      className={`!h-[2.8rem] lg:!h-theme md:w-full gap-3 !w-[100%] ${buy_now && "!w-[100%] !bg-white !border-[2px] !text-black"}`}
    >
      {loading && !buy_now && <LoadingIcon className="animate-spin" />}
      {!loading && !buy_now && <AddToCartIcon />}
      {loading ? "Adding to cart..." : buy_now ? "BUY NOW" : "ADD TO CART"}
    </Button>
    
     )}
    </>
  )
}
