"use client"

import { TextArea } from "@/interface/fragments";
import { CartItem } from "@/types/store/cart";
import { useCartStore } from "@/zustand/store/cartStore";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";

type UserAdditionalMessage = {
  id: any
  setMessage: Dispatch<SetStateAction<{
    allow: boolean
    label: string;
    message: string;
 }>>
 errorMessages: { photos: boolean, message: boolean }
 setErrorMessages: Dispatch<SetStateAction<{
  photos: boolean;
  message: boolean;
}>>
}

export default function UserAdditionalMessage({ setMessage, id, errorMessages, setErrorMessages }: UserAdditionalMessage) {
  const { items, update_additional_message } = useCartStore();
  const [defaultMessage, setDefaultMessage] = useState<string>()

  const handleMessage = (e:  ChangeEvent<HTMLInputElement>) => {
    setErrorMessages((prevData => ({
      ...prevData,
      message: false
    })))
    setMessage(prevState => ({
      ...prevState,
      message: e.target.value
    }));
    update_additional_message(id, e.target.value)

    const storedItems = localStorage.getItem("cartItems");
    if(storedItems){
      const prevItems = JSON.parse(storedItems);
      const updatedItems = prevItems.map((item: CartItem) => {
        if (item.id === id) {
          return {
            ...item,
            additional_message: {
              ...item.additional_message,
              message: e.target.value,
            },
          };
        }
        return item;
      })
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }
  }

  useEffect(() => {
    items.forEach((item) => {
      if(item.id === id){
        setDefaultMessage(item.additional_message.message)
      }
     })
  }, [items])
  

  return (
    <TextArea
      defaultValue={defaultMessage}
      onChange={handleMessage}
      placeHolder="Enter your message" 
      className="w-full bg-gray-100 text-[12px] !h-[3rem]"
      errorMessage="*Please fill this field"
      invalid={errorMessages.message}
    />
  )
}
