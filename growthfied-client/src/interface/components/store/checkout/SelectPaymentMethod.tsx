"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Div, RadioButton, Typography } from "@/interface/fragments";
import { BackButtonIcon, LoadingIcon } from "@/interface/icons";
import { CheckoutAddressType } from "@/types/store/checkout";
import { useCartStore } from "@/zustand/store/cartStore";
import { toast } from "sonner";
import { placeOrder, verifyRazorpayPayment } from "@/@api/store/orders.api";
import { useParams, useRouter } from "next/navigation";
import { usePriceStore } from "@/zustand/store/priceStore";
import { CartItem } from "@/types/store/cart";
import { useOrderCompleteStore } from "@/zustand/store/orderComplete";
import { revalidateServerAction } from "@/app/actions";
import { formatOrderDate, formatOrderTime } from "@/utils";
import { BACKEND_URL } from "../../../../../config";
import { useOrderFailedStore } from "@/zustand/store/orderFailed";
import { CheckoutSummary } from "@/interface/components";
import OrderConflictPopup from "./OrderConflictPopup";

type SelectPaymentMethodProps = {
    setStep: Dispatch<SetStateAction<"delivery_address" | "payment_method">>
    checkoutAddress: CheckoutAddressType
  }

export default function SelectPaymentMethod({ setStep, checkoutAddress }: SelectPaymentMethodProps) {

  const { items, clear_cart } = useCartStore();
  const { coupen_code, delivery_charge, payment_method, update_coupen } = usePriceStore()
  const { update_order_complete } = useOrderCompleteStore()
  const { update_order_failed } = useOrderFailedStore()
  const params = useParams()
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | "disabled" >("online")
  const [orderConflictOpen, setOrderConflictOpen] = useState(false)
  const [orderConflictMessage, setOrderConflictMessage] = useState({
    title: "",
    description: "",
    type: "",
  })
  const [updatedCart, setUpdatedCart] = useState<CartItem[]>([])
  const [updatedDeliveryCharge, setUpdatedDeliveryCharge] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(payment_method.online.enabled){
      setPaymentMethod("online")
    }else{
      setPaymentMethod("cod")
    }
    if(payment_method.online.enabled === false && payment_method.cod === false){
      setPaymentMethod("disabled")
    }
  }, [payment_method])

  function findHighestDeliveryDays(): number {
    return items.reduce((maxDays, item) => {
      return Math.max(maxDays, item.delivery_days);
    }, 0); // Start with 0 as the initial value
  }
  
  const handleConfirmOrder = async () => {
    setLoading(true)
    const orderData = {
      shipping_address: checkoutAddress,
      items: items,
      payment_method: paymentMethod,
      username: params.username,
      coupen_code: coupen_code,
      date: formatOrderDate(new Date()),
      time: formatOrderTime(new Date()),
      delivery_charge: delivery_charge.amount,
      delivery_days: findHighestDeliveryDays(),

    }
    
    try {
      const res = await placeOrder(orderData)

      if(paymentMethod === "online"){
      // razorpay integration
      const options = {
        "key": `${res.data?.key_id}`,
        "name": `${res.data.store_name}`,
        "description": "Online Transaction",
        "image": `${BACKEND_URL}/public/images/profiles/${res.data?.profile_picture}`,
        "order_id": res.data?.id,
        "handler": function (response: any){
          verifyRazorpayPayment({
            order_id: res.data?.order_id, 
            razorpay_order_id: response.razorpay_order_id, 
            razorpay_payment_id: response.razorpay_payment_id, 
            razorpay_signature: response.razorpay_signature,
            username: params.username
          }).then((data => {
            toast.success("Order Completed Succssfully")
            update_order_complete({
              order_id: res.data.order_id,
              order_status: true,
              store_name: params.username,
              customer_phone_number: res.data.customer_phone_number,
              store_phone_number: res.data.store_phone_number,
              domain_name: res.data.domain_name,
              is_domain_enabled: res.data.is_domain_enabled,
            })
            clear_cart()
            revalidateServerAction("product")
            update_coupen({
              applied: false,
              code: "",
              discount: {
                amount: 0,
                type: "fixed"
              },
              minimum: 0
            })
            items.map((data: any) => {
              localStorage.removeItem(data.id)
              localStorage.removeItem(`tempimg_id-${data.id}`)
            })
            router.push("/order-success")
          })).catch((data => {
            console.log(data)
            if(data.response.request.status === 404){
              toast.error("Your Order failed!")
              update_order_failed({
                order_status: false,
                payment_id: response.razorpay_payment_id,
                store_phone_number: res.data.customer_phone_number,
                message: "Your order failed due to some reason, please contact support team"
              })
              clear_cart()
              revalidateServerAction("product")
              update_coupen({
               applied: false,
               code: "",
               discount: {
                amount: 0,
                 type: "fixed"
               },
               minimum: 0
             })
             items.map((data: any) => {
              localStorage.removeItem(data.id)
              localStorage.removeItem(`tempimg_id-${data.id}`)
             })
             router.push("/order-failed")
            }
            if(data.response.request.status === 400){
              toast.error("Your order failed due to some reason, please contact support team")
              update_order_failed({
                order_status: false,
                payment_id: response.razorpay_payment_id,
                store_phone_number: res.data.customer_phone_number,
                message: "Payment Signature failed"
              })
              clear_cart()
              revalidateServerAction("product")
              update_coupen({
               applied: false,
               code: "",
               discount: {
                amount: 0,
                 type: "fixed"
               },
               minimum: 0
             })
             items.map((data: any) => {
              localStorage.removeItem(data.id)
              localStorage.removeItem(`tempimg_id-${data.id}`)
             })
             router.push("/order-failed")
            }
            if(data.status === 500){
              toast.success("Your Order failed!")
              update_order_failed({
                order_status: false,
                payment_id: response.razorpay_payment_id,
                store_phone_number: res.data.customer_phone_number,
              })
              clear_cart()
              revalidateServerAction("product")
              update_coupen({
               applied: false,
               code: "",
               discount: {
                amount: 0,
                 type: "fixed"
               },
               minimum: 0
             })
             items.map((data: any) => {
              localStorage.removeItem(data.id)
             })
             router.push("/order-failed")
            }
          }))
        },
        "prefill": { 
            "name": checkoutAddress.full_name,
            "email": checkoutAddress.email, 
            "contact": checkoutAddress.mobile_number
        },
        "notes": {
            "order_id": `${res.data.order_id}`,
            "store_name": `${res.data.store_name}`,
            "address": `
             ${checkoutAddress.full_name}, 
             ${checkoutAddress.address}, 
             ${checkoutAddress.city}, 
             ${checkoutAddress.landmark} 
             ${checkoutAddress.pincode} 
             ${checkoutAddress.state}
            `
        },
        "theme": {
            "color": "#3399cc"
        }
       };

       const paymentObject = new (window as any).Razorpay(options);
       paymentObject.on('payment.failed', function (response: any) {
         alert(response.error.description);
        });
       paymentObject.open();
      }

      // handle cod
      if(paymentMethod === "cod"){
      toast.success("Order Completed Succssfully")
      update_order_complete({
        order_id: res.data.order_id,
        order_status: res.data.order_status,
        store_name: res.data.store_name,
        customer_phone_number: res.data.customer_phone_number,
        store_phone_number: res.data.store_phone_number,
        domain_name: res.data.domain_name,
        is_domain_enabled: res.data.is_domain_enabled,
      })
      clear_cart()
      revalidateServerAction("product")
      update_coupen({
        applied: false,
        code: "",
        discount: {
          amount: 0,
          type: "fixed"
        },
        minimum: 0
      })
      items.map((data: any) => {
        localStorage.removeItem(data.id)
        localStorage.removeItem(`tempimg_id-${data.id}`)
      })
      router.push("/order-success")
    }
    } catch (error:any) {
      setLoading(false)
      if(error?.response?.status === 409){
        console.log(error,"@error")
        if(error.response.data.code === "CODE1"){
          setOrderConflictOpen(true)
          setOrderConflictMessage({
            title: "Some items are unavailable!",
            description: "We’re sorry, some of the products in your cart are no longer available, Please click ‘Update Cart’ to refresh your cart with the latest updates.",
            type: "CODE1"
          })
          setUpdatedCart(error.response.data.updatedCart)
          setUpdatedDeliveryCharge(error.response.data.updatedDeliveryCharge)
          return
        }
        if(error.response.data.code === "CODE2"){
          setOrderConflictOpen(true)
          setOrderConflictMessage({
            title: "Product Prices have been updated!",
            description: "We’re sorry, some of the products in your cart amount updated, Please click ‘Update Cart’ to refresh your cart with the latest updates.",
            type: "CODE2"
          })
          setUpdatedCart(error.response.data.updatedCart)
          setUpdatedDeliveryCharge(error.response.data.updatedDeliveryCharge)
          return
        }
        if(error.response.data.code === "CODE3"){
          setOrderConflictOpen(true)
          setOrderConflictMessage({
            title: "Delivery Charge have been updated!",
            description: "We’re sorry, Delivery Charge have been updated, Please click ‘Update Cart’ to refresh your cart with the latest updates.",
            type: "CODE3"
          })
          setUpdatedDeliveryCharge(error.response.data.updatedDeliveryCharge)
          return
        }
        if(error.response.data.code === "CODE4"){
          setOrderConflictOpen(true)
          setOrderConflictMessage({
            title: "Coupen Code is not available!",
            description: "We’re sorry, Coupen Code is not available, Please click ‘Update Cart’ to refresh your cart with the latest updates.",
            type: "CODE4"
          })
          setUpdatedDeliveryCharge(error.response.data.updatedDeliveryCharge)
          return
        }
        if(error.response.data.code === "CODE5"){
          setOrderConflictOpen(true)
          setOrderConflictMessage({
            title: "Coupen Code is Expired!",
            description: "We’re sorry, Coupen Code is expired, Please click ‘Update Cart’ to refresh your cart with the latest updates.",
            type: "CODE5"
          })
          setUpdatedDeliveryCharge(error.response.data.updatedDeliveryCharge)
          return
        }
        if(error.response.data.code === "CODE6"){
          setOrderConflictOpen(true)
          setOrderConflictMessage({
            title: "Coupen Code Minimum Amount Changed!",
            description: "We’re sorry, Coupen Code minimum amount changed, Please click ‘Update Cart’ to refresh your cart with the latest updates.",
            type: "CODE5"
          })
          setUpdatedDeliveryCharge(error.response.data.updatedDeliveryCharge)
          return
        }
      }else{
        toast.error("Order Placing Failed!")
        setLoading(false)
      }
    }
  }

  return (
    <>
    <OrderConflictPopup
     open={orderConflictOpen}
     title={orderConflictMessage.title}
     content={orderConflictMessage.description}
     type={orderConflictMessage.type}
     loading={false}
     onClose={()=> setOrderConflictOpen(false)}
     updatedCart={updatedCart}
     updatedDeliveryCharge={updatedDeliveryCharge}
    />
    <Div className="w-full flex flex-col items-center" >
      <Div className="w-[90%] md:w-[30rem] mt-4" >
        <Div className="w-full flex" >
           <Div onClick={()=> setStep("delivery_address")} className="hover:bg-[#d6d4d4c6] rounded-[2px] flex items-center justify-center w-[2rem] h-[1.5rem]" >
            <BackButtonIcon/>
           </Div>
           <Typography className="font-medium ml-4" >Select Payment Options</Typography>
        </Div>

        <Div className="w-full box shadow rounded-[4px] bg-white border border-gray-100 px-[18px] py-[18px] mt-4" >
            <Div className="flex flex-col gap-3 mt-2" >
             { payment_method.online.enabled && (
              <Div onClick={()=> setPaymentMethod("online")} className={`flex gap-1 items-center border-2 p-[10px] cursor-pointer hover:border-black rounded-[3px] ${paymentMethod === "online" && "border-black"}`} >
              <RadioButton onChange={()=> {}} checked={paymentMethod === "online"} name="payment_method" />
              <Typography className="text-[12px]" >Online Payment (UPI, Google Pay, etc)</Typography>
             </Div>
              )}
             { payment_method.cod && (
              <Div onClick={()=> setPaymentMethod("cod")} className={`flex gap-1 items-center border-2 p-[10px] cursor-pointer hover:border-black rounded-[3px] ${paymentMethod === "cod" && "border-black"}`} >
              <RadioButton onChange={()=> {}} checked={paymentMethod === "cod"} name="payment_method" />
              <Typography className="text-[12px]" >Cash on Delivery (CoD)</Typography>
              </Div>
             )}
            </Div>
        </Div>
        <CheckoutSummary payment_method={paymentMethod} />
        {paymentMethod !== "disabled" && paymentMethod === "online" && (
          <Button onClick={handleConfirmOrder} className="mt-3 w-full" disabled={loading}>
           {loading ? <LoadingIcon className="animate-spin" /> : "Pay Now"}
          </Button>
        )}
        {paymentMethod !== "disabled" && paymentMethod === "cod" && (
          <Button onClick={handleConfirmOrder} className="mt-3 w-full" disabled={loading}>
           {loading ? <LoadingIcon className="animate-spin" /> : "Confirm Order"}
          </Button>
        )}

      </Div>
    </Div>
    </>
  )
}
