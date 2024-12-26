"use client";

import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, Form, InputField, Typography } from "@/interface/fragments";
import { formValidation } from "@/utils/formValidation";
import { toast } from "sonner";
import { LoadingIcon, TickIcon } from "@/interface/icons";
import { getCoupenStatus as getCoupenStatusApi } from "@/@api/store/orders.api";
import { getCoupenStatus } from "@/utils";
import { useCartStore } from "@/zustand/store/cartStore";
import { usePriceStore } from "@/zustand/store/priceStore";

type ApplyCoupenProps = {
  total: number
  className?: string
}

export default function ApplyCoupen({ total, className }: ApplyCoupenProps) {

  const param = useParams()
  const { items } = useCartStore()
  const { update_coupen, coupen_code } = usePriceStore()

  const [coupen, setCoupen] = useState<string>("")
  const [formErrors, setFormErrors] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [flag, setFlag] = useState(false)

  useEffect(() => {
      const timeoutId = setTimeout(() => {
        setFormErrors({})
        if (coupen_code.applied === true) {
          if (coupen_code.minimum > total) {
              toast.error("Your Coupon Removed", { position: "bottom-left" });
              update_coupen({
                applied: false,
                code: "",
                discount: {
                  type: "fixed",
                  amount: 0
                },
                minimum: 0
              })
              setFormErrors({})
              setCoupen("")
              setFlag(false)
          } else {
                if(flag === false) toast.success("Coupon applied successfully", { position: "bottom-left" });
                update_coupen({
                  applied: true,
                  code: coupen_code.code,
                  discount: {
                    amount: coupen_code.discount.amount,
                    type: coupen_code.discount.type
                  },
                  minimum: coupen_code.minimum
                })
                setFormErrors({});
                setFlag(true)
          }
        }
      }, 200);

      return () => {
        clearTimeout(timeoutId)
      }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);
  

  useEffect(() => {
    if(coupen_code.applied){
      setCoupen(coupen_code.code)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormErrors({})
    setCoupen(e.target.value.toUpperCase())
  }

  const handleSubmit = async (e: any) => {
    if(e) e.preventDefault()
    // form validation
    const newFormErrors = formValidation({coupen});
    setFormErrors(newFormErrors);
    const errorLength = Object.keys(newFormErrors).length;
    if (errorLength > 0){
      if(coupen_code.applied){
        update_coupen({
          applied: false,
          code: "",
          discount: {
            type: "fixed",
            amount: 0
          },
          minimum: 0
        })
      }
      toast.error("Your Coupon Removed", { position: "bottom-left" });
      return
    }
    setLoading(true)

    if(coupen_code.applied){
      setLoading(false)
      if(coupen_code.code === coupen) return
    }
    
    try {
      // api call
      const res = await getCoupenStatusApi(param.username.toString(), coupen)
      if(res.data.status){
        const coupen_status = getCoupenStatus(res.data?.end_date, res.data?.used, res.data?.count)
        if(coupen_status === "Running"){
          if(res.data.minimum > total){
            setFormErrors({ coupen: `For only orders above ₹${res.data.minimum}` })
            setCoupen("")
          }else{
            toast.success("Coupen applied successfully",{ position: "bottom-left"})
            update_coupen({
              applied: true,
              code: res.data.coupen_code,
              discount: {
                type: res.data.discount.type,
                amount: res.data.discount.value
              },
              minimum: res.data.minimum
            })
            setFlag(true)
          }
        }else{
          setFormErrors({ coupen: "Your coupen is expired" })
          update_coupen({
            applied: false,
            code: "",
            discount: {
              type: "fixed",
              amount: 0
            },
            minimum: 0
          })
        }
      }else{
        setFormErrors({ coupen: "Invalid coupen" })
        setCoupen("")
        update_coupen({
          applied: false,
          code: "",
          discount: {
            type: "fixed",
            amount: 0
          },
          minimum: 0
        })
      }

      setLoading(false)
    } catch (error) {
      toast.error("Something went wrong!")
      setLoading(false)
    }
  };

  return (
    <Div className={`mt-[2rem] flex gap-2 ${className}`} >
      <Form onSubmit={handleSubmit} >
      <InputField
        type="text"
        placeHolder="Discount Coupen"
        className={`text-[12px] uppercase placeholder:!capitalize`}
        invalid={!!formErrors?.coupen}
        errorMessage={formErrors?.coupen}
        onChange={handleChange}
        value={coupen}
      />
      { coupen_code.applied && <Div className="flex gap-1 items-center" >
       <Typography className="text-green-500 text-[12px] font-semibold mt-[2px] ml-[5px]" >
        Coupen Applied
       </Typography>
       <TickIcon className="!w-[15px] !h-[15px] !fill-green-600" />
      </Div>}

      </Form>
      <Button disabled={loading} onClick={handleSubmit} className={`w-[6rem] ${coupen === "" && "!bg-gray-300 hover:!bg-black"}`}>
       {loading ? <LoadingIcon className="animate-spin" /> : "Apply"}
      </Button>
    </Div>
  );
}
