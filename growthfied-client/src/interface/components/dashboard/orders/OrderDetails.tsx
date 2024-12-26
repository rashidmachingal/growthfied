"use client"

import { useEffect, useState } from "react";
import { Button, Div, Span, Typography } from "@/interface/fragments";
import { Box, ConfirmPopup, Label, OrderCustomTrackingLink, OrderImagesPopup, UpdateOrderStatusPopup } from "@/interface/components";
import { TickIcon } from "@/interface/icons";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { cancelOrder, disableTrackingLink, getOrderDetails, reOpenOrder } from "@/@api/dashboard/orders.api";
import { useParams } from "next/navigation";
import Cookies from "universal-cookie";
import { formatDate, formatDateDDMMYYYY, formatOrderDate, formatOrderTime } from "@/utils";
import Link from "next/link";
import { DOMAIN_NAME } from "../../../../../config";
import Image from "next/image";
import ReactSwitch from "react-switch";
import { toast } from "sonner";

export default function OrderDetails() {

    const { update_unauthorized, username } = useUserStore()
    const params = useParams()

    const [loading, setLoading] = useState(true)
    const [orderDetails, setOrderDeatils] = useState<any>()
    const [updateOrderStatusOpen, setUpdateOrderStatusOpen] = useState(false)
    const [orderImageOpoenOpen, setOrderImagesOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("empty")
    const [customerPhotos, setCustomerPhotos] = useState<any>()
    const [cancelPopup, setCancelPopup] = useState(false)
    const [cancelLoading, setCancelLoading] = useState(false)
    const [reFetch, setReFetch] = useState(false)
    const [customTrackingLinkPopup, setCustomTrackingLinkPopup] = useState(false)
    const [customTrackingLinkSwtich, setCustomTrackingLinkSwtich] = useState(false)
    const [customTrackingLinkDefault, setCustomTrackingLinkDefault] = useState(false)
    const [customTrackingLinkDisablePopup, setCustomTrackingLinkDisablePopup] = useState(false)
    const [customTrackingLinkLoading, setCustomTrackingLinkLoading] = useState(false)
    const [reOpenPopup, setReOpenPopup] = useState(false)

    // fetch
    const fetchOrderDetails = async () => {
        setLoading(true)
      try {
        const res = await getOrderDetails(params.id)
        setOrderDeatils(res.data)
        setLoading(false)
        setCustomTrackingLinkSwtich(res?.data?.custom_tracking_url?.applied)
        setCustomTrackingLinkDefault(res?.data?.custom_tracking_url?.applied)
      } catch (error: any) {
        if (error.response.status === 401) {
         const cookies = new Cookies();
         cookies.remove("token", { path: "/" });
         update_unauthorized()
        }
        setErrorMessage("Failed to fetch data, please retry")
        setLoading(false)
      }
    }

      
    useEffect(() => {
      fetchOrderDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reFetch])

    const handleDisableCustomTrackingLink = async () => {
      try {
        setCustomTrackingLinkLoading(true)
        await disableTrackingLink(orderDetails._id)
        toast.success("Custom tracking link disabled")
        setCustomTrackingLinkDefault(false)
        setCustomTrackingLinkSwtich(false)
        setCustomTrackingLinkLoading(true)
        setCustomTrackingLinkDisablePopup(false)
      } catch (error: any) {
        if (error.response.trackingLink === 401) {
         const cookies = new Cookies();
         cookies.remove("token", { path: "/" });
         update_unauthorized()
        }
        setLoading(false)
        toast.error("Something went wrong, failed to update!")
        setCustomTrackingLinkDisablePopup(false)  
      }
    }

    const handleSwitchCustomTrackingLink = () => {
      if(customTrackingLinkDefault){
        setCustomTrackingLinkDisablePopup(true)
      }else{
        setCustomTrackingLinkPopup(prev=> !prev)
        setCustomTrackingLinkSwtich(prev=> !prev)
      }
    }

    const handleCancelOrder = async () => {
      try {
        setCancelLoading(true)
        await cancelOrder(orderDetails?._id, {
          date: formatOrderDate(new Date()),
          time: formatOrderTime(new Date())
        })
        setCancelLoading(false)
        setCancelPopup(false)
        toast.success("Order cancelled successfully")
        setReFetch(prev=> !prev)
      } catch (error: any) {
        setCancelLoading(false)
        if (error.response.trackingLink === 401) {
         const cookies = new Cookies();
         cookies.remove("token", { path: "/" });
         update_unauthorized()
        }
        setLoading(false)
        toast.error("Something went wrong, failed to cancel!")
        setCancelPopup(false)  
      }
    }

    const handleReOpenOrder = async () => {
      try {
        setCancelLoading(true)
        await reOpenOrder(orderDetails?._id, {
          date: formatOrderDate(new Date()),
          time: formatOrderTime(new Date())
        })
        setCancelLoading(false)
        setReOpenPopup(false)
        toast.success("Order re-opened successfully")
        setReFetch(prev=> !prev)
      } catch (error: any) {
        setCancelLoading(false)
        if (error.response.trackingLink === 401) {
         const cookies = new Cookies();
         cookies.remove("token", { path: "/" });
         update_unauthorized()
        }
        setLoading(false)
        toast.error("Something went wrong, failed to re-open!")
        setCancelPopup(false)  
      }
    }

  return (
    <>
    <OrderCustomTrackingLink
      onClose={()=> setCustomTrackingLinkPopup(prevData=> !prevData)}
      open={customTrackingLinkPopup}
      orderDetails={orderDetails}
      setReFetch={setReFetch}
    />
    <UpdateOrderStatusPopup 
      setReFetch={setReFetch}
      orderDetails={orderDetails}
      open={updateOrderStatusOpen} 
      onClose={()=> setUpdateOrderStatusOpen(false)}
    />
    <OrderImagesPopup 
      order_id={orderDetails?.order_id} 
      customer_photos={customerPhotos} 
      open={orderImageOpoenOpen} 
      onClose={()=> setOrderImagesOpen(false)}
    />
    <ConfirmPopup
     buttonText="Disable"
     content="Are you sure to disable custom trcking link"
     loading={customTrackingLinkLoading}
     open={customTrackingLinkDisablePopup}
     onClose={()=> {
      setCustomTrackingLinkDisablePopup(false)
      setCustomTrackingLinkSwtich(true)
     }}
     isCancel
     onSubmit={handleDisableCustomTrackingLink}
     title="Are you sure to disable?"
    />
    <ConfirmPopup
     buttonText="Confirm"
     content="This action will change the order status to cancel"
     loading={cancelLoading}
     open={cancelPopup}
     onClose={()=> setCancelPopup(false)}
     isCancel
     onSubmit={handleCancelOrder}
     title="Are you sure cancel this order?"
    />
    <ConfirmPopup
     buttonText="Confirm"
     content="This action will change the order status to re-open"
     loading={cancelLoading}
     open={reOpenPopup}
     onClose={()=> setReOpenPopup(false)}
     isCancel
     onSubmit={handleReOpenOrder}
     title="Are you sure re-open this order?"
    />
    {/* skelton */}
    {loading && (
        <Div className="w-full bg-white p-[9px] flex flex-col gap-[15px] py-[0.8rem]" >
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
        <Div className="flex items-center gap-5" >
          <Div className="w-full rounded-[2px] h-[2.5rem] placeholder-animation"></Div>
        </Div>
      </Div>
      )}
    { loading === false && (<Div className="mt-[18px] flex items-start flex-col lg:flex-row gap-[15px] w-full" >
    <Box className="!rounded-none !rounded-t-theme  pb-[10px]" >
            <Div className="w-full bg-[#f5f5f5] p-[5px] pl-[8px] text-[14px]  rounded-t-theme border" >
                <Typography className="font-medium" >BASIC DETAILS</Typography>
            </Div>
            <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Order Id</Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >{orderDetails?.order_id}</Typography>
            </Div>
            <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Order Date</Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >{formatDateDDMMYYYY(orderDetails?.order_date)}, {orderDetails?.order_time}</Typography>
            </Div>
            <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Payment Method</Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >{orderDetails?.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}</Typography>
            </Div>
            {orderDetails?.payment_method === "online" && (
              <>
              <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Razorpay Order Id</Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >{orderDetails?.razorpay_order_id}</Typography>
              </Div>
              <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Razorpay Payment Id</Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >{orderDetails?.razorpay_payment_id}</Typography>
              </Div>
              </>
            )}
            {/* <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Total Items</Typography>
                <Typography  className="text-[11px]  md:text-[12px] text-gray-500" >3</Typography>
            </Div> */}
            <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Total Amount</Typography>
                <Typography  className="text-[11px]  md:text-[12px] text-gray-500" >₹{orderDetails?.price_details?.net_total}</Typography>
            </Div>
            <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Customer Order Tracking URL</Typography>
                <Link href={`http://${username}.${DOMAIN_NAME}/track-order?ph=${orderDetails?.shipping_address?.mobile_number}&order_id=${orderDetails?.order_id}`} >
                <Typography  className="text-[11px]  md:text-[12px] text-gray-500" >http://{username}.{DOMAIN_NAME}/track-order?ph={orderDetails?.shipping_address?.mobile_number}&order_id={orderDetails?.order_id}</Typography>
                </Link>
            </Div>
        </Box>
        <Box className="!rounded-none !rounded-t-theme pb-[10px]" >
            <Div className="w-full bg-[#f5f5f5] p-[5px] pl-[8px] text-[14px] rounded-t-theme border" >
                <Typography className="font-medium" >ORDER STATUS</Typography>
            </Div>
            <Div className="p-[5px] pt-[10px] pl-[8px] flex items-center gap-2" >  
                <Typography className="text-[12px] text-gray-600 font-medium uppercase" >Status:</Typography>
                <Label title={orderDetails?.order_last_status} className={`
                  ${orderDetails?.order_last_status === "Processing" && "bg-yellow-200 text-yellow-600"} 
                  ${orderDetails?.order_last_status === "Shipped" && "bg-green-200 text-green-600"} 
                  ${orderDetails?.order_last_status === "Completed" && "bg-green-200 text-green-600"} 
                  ${orderDetails?.order_last_status === "Cancelled" && "bg-red-200 text-red-600"} 
                  ${orderDetails?.order_last_status !== "Cancelled" && orderDetails?.order_last_status !== "Completed" && orderDetails?.order_last_status !== "Shipped" && orderDetails?.order_last_status !== "Processing" && "bg-green-200 text-green-600"} 
                  px-2`
                } 
            />
            </Div>
            <Div className="p-[5px] mt-[3px] pl-[8px]" >  
                <Typography className="text-[12px] text-gray-600 font-medium uppercase" >Expected Delivery on</Typography>
                <Typography className="text-[12px]" >{formatDate(orderDetails?.expected_delivery_date)}</Typography>
            </Div>
            <Div className="p-[5px] pl-[8px]" > 

                {orderDetails?.order_progress?.slice().reverse().map((item: any, index: number) => {
                  return(
                  <Div key={index} className="flex gap-[4px]" >
                    <Div className="flex flex-col items-center" >
                     <TickIcon className="!fill-green-600" />
                     { orderDetails?.order_progress.length - 1 !== index && (<Div className="w-[2px] h-[1.5rem] bg-green-600 mt-[-3px]" />)}
                    </Div>
                    <Div className="mt-[-3px]" >
                     <Typography className="text-[12px]" >{item.status}</Typography>
                     <Typography className="text-[10px] text-gray-500" >{item.date}, {item?.time}</Typography>
                    </Div>
                   </Div>
                  )
                })}

            </Div>
            {orderDetails?.is_order_cancelled && (
              <Div className="px-[8px]" >
                <Button onClick={()=> setReOpenPopup(true)} className="w-full !bg-yellow-500" >Re-Open Order</Button>
              </Div>
            )}
            { !orderDetails?.is_order_cancelled && (<Div className="p-[5px] pl-[8px] mt-3" >  
                <Button onClick={()=> setUpdateOrderStatusOpen(true)} className="w-full" >Update Order Status</Button>
                { customTrackingLinkDefault && (<Typography className="mt-[6px] text-[12px] text-yellow-500 font-semibold" >
                  Your delivery partner tracking link enabled, 
                  When customers provide tracking details, 
                  redirects them to your partner&#39;s tracking link.
                </Typography>)}
                <Div className="flex justify-between mt-3" >
                  <Typography className="text-[13px]" >Enable Delivery Partner Tracking Link</Typography>
                  <ReactSwitch width={38} height={20} boxShadow="0px 1px 5px #00000099"  onColor="#333" checkedIcon={false} uncheckedIcon={false} checked={customTrackingLinkSwtich} onChange={handleSwitchCustomTrackingLink} />
                </Div>
            </Div>)}
        </Box>
        
        <Box className="!rounded-none !rounded-t-theme  pb-[10px]" >
            <Div className="w-full bg-[#f5f5f5] p-[5px] pl-[8px] text-[14px]  rounded-t-theme border" >
                <Typography className="font-medium" >BUYER DETAILS</Typography>
            </Div>
            <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Name</Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >{orderDetails?.shipping_address?.full_name}</Typography>
            </Div>
            <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Shipping Address</Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >
                  {orderDetails?.shipping_address?.address}, {orderDetails?.shipping_address?.landmark}, {orderDetails?.shipping_address?.city}, {orderDetails?.shipping_address?.state}
                </Typography>
                <Typography  className="text-[11px] md:text-[12px] text-gray-500" >
                  Pin: {orderDetails?.shipping_address?.pincode}
                </Typography>
            </Div>
                <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Email</Typography>
                <Div className="flex justify-between" >
                 <Typography  className="text-[11px]  md:text-[12px] text-gray-500" >{orderDetails?.shipping_address?.email}</Typography>
                </Div>
                </Div>
                <Div className="p-[5px] pl-[8px]" >  
                <Typography className="text-[12px] font-medium uppercase" >Phone Number</Typography>
                <Div className="flex justify-between" >
                 <Typography  className="text-[11px]  md:text-[12px] text-gray-500" >+91 {orderDetails?.shipping_address?.mobile_number}</Typography>
                </Div>
                </Div>
                <Div className="p-[5px] pl-[8px]" >  
                <Div className="flex gap-3" >
                <Button type="link" url={`tel:+91${orderDetails?.shipping_address?.mobile_number}`} className="!h-[1.9rem] !text-[10px] !rounded-full" >Call</Button>
                <Button type="link" url={`https://api.whatsapp.com/send?phone=+91${orderDetails?.shipping_address?.mobile_number}`} className="!h-[1.9rem] !text-[10px] !rounded-full !bg-green-600 !text-white" >Chat on Whataspp</Button>
                </Div>
            </Div>
        </Box>
    </Div>)}

    { loading === false && <Div className="w-full flex items-center text-[12px] mt-[18px]" >
        <Span className="w-full h-[1px] bg-gray-300" />
        <Div className="w-[25rem]" >
        <Typography className="w-full text-center text-[13px] text-gray-600" >Order Product Details</Typography>
        </Div>
        <Span className="w-full h-[1px] bg-gray-300" />
    </Div>}

    { !orderDetails?.is_order_cancelled && (<Div className="w-full flex justify-end py-2" >
        <Button onClick={()=> setCancelPopup(true)} className="!bg-red-600" >Cancel Order</Button>
      </Div>)}

    {/* product details */}
  

    { loading === false && <Div className="mt-5 w-full rounded-theme shadow-sm">
      <Div className="w-full h-[2.3rem] border rounded-t-theme bg-[#f5f5f5] uppercase hidden md:flex items-center px-6 ">
        <Div className="w-[35%] text-center">
          <Typography className="text-[11px] font-semibold">Item</Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Quantity</Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Amount</Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Total Amount</Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Additional Message</Typography>
        </Div>
        <Div className="w-[25%] text-center">
          <Typography className="text-[11px] font-semibold">Images</Typography>
        </Div>
      </Div>
      

      {/* pc */}
      <Div className="hidden md:flex flex-col">
        {orderDetails?.items?.map((data: any, index: number) => {
          return(
            <Div key={index} className="w-full min-h-[2.5rem] border-b flex items-center px-6 bg-white">
          <Div className="w-[35%] text-center py-2 hover:underline">
            <Div className="flex items-center gap-3" >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                width={100}
                height={100}
                className="w-[3.5rem]"
                src={data?.image}
                alt=""
              />
              <Link href={`http://${username}.${DOMAIN_NAME}/product/${data.url}`} target="_blank" >
               <Typography className="text-[11px] cursor-pointer flex flex-col">
                {data?.title} 
                { data?.variant?.variant_name !== "" && <Span className="font-semibold" >{data?.variant?.variant_name} : {data?.variant?.selected_option}</Span>}
               </Typography>
              </Link>
            </Div>
          </Div>
          <Div className="w-[25%] text-center">
            <Typography className="text-[11px]">{data?.quantity}</Typography>
          </Div>
          <Div className="w-[25%] text-center">
            <Typography className="text-[11px]">₹{data?.selling_price}</Typography>
          </Div>
          <Div className="w-[25%] text-center">
            <Typography className="text-[11px]">₹{data?.selling_price * data?.quantity}</Typography>
          </Div>
          <Div className="w-[25%] text-center">
            { data?.additional_message.allow &&
             <Typography className="text-[11px] flex flex-col">
              <Span className="font-semibold" >{data?.additional_message?.label}</Span>
              {data.additional_message.message}
            </Typography>
            }
          </Div>
          <Div className="w-[25%] flex items-center justify-center">
            {( data?.tempimg_id !== null && 
             <Div className="text-[11px]">
                <Button onClick={()=> {
                  setOrderImagesOpen(true)
                  setCustomerPhotos(data?.customer_photos)
                }} className="!text-[10px] !h-[2rem] !rounded-full"  >Download Images</Button>
             </Div>
            )}
          </Div>
        </Div>
          )
        })}
      </Div>



      {/* mobile */}
      <Div className="flex flex-col gap-4 md:hidden">
        {orderDetails?.items?.map((data: any, index: number) => {
          return(
         <Div key={index}  className="hover:border-black border border-transparent w-full min-h-[2.5rem] pb-3 rounded flex flex-col px-6 relative bg-white">
          <Div className="w-[90%] hover:underline">
            <Div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                width={100}
                height={100}
                className="w-[3.5rem] mt-3"
                src={data?.image}
                alt=""
              />
              <Link href={`http://${username}.${DOMAIN_NAME}/product/${data.url}`} target="_blank" >
               <Typography className="text-[12px] font-medium cursor-pointer flex flex-col">
                {data?.title} 
                { data?.variant?.variant_name !== "" && <Span className="font-semibold" >{data?.variant?.variant_name} : {data?.variant?.selected_option}</Span>}
               </Typography>
              </Link>
            </Div>
          </Div>

          <Div className="flex justify-between flex-wrap gap-2" >
           <Div className="flex gap-2 mt-1" >
            <Typography className="text-xs" >Quantity :</Typography>
            <Typography className="text-[11px]">{data?.quantity}</Typography>
           </Div>
          </Div>

          <Div className="flex  flex-wrap gap-2" >
           <Div className="flex gap-2 mt-1" >
            <Typography className="text-xs" >Total Amount :</Typography>
            <Typography className="text-[11px]">₹198 x {data?.quantity} = ₹{data?.selling_price * data?.quantity}</Typography>
           </Div>
          </Div>

          <Div className="mt-2" >
            { data?.additional_message.allow && <Typography className="text-xs" >Additional Message :</Typography>}
            { data?.additional_message.allow &&
             <Typography className="text-[11px] flex flex-col">
              <Span className="font-semibold" >{data?.additional_message?.label}</Span>
              {data.additional_message.message}
            </Typography>
            }
          </Div>
          {( data?.tempimg_id !== null && 
             <Div className="text-[11px] mt-2">
                <Button onClick={()=> {
                  setOrderImagesOpen(true)
                  setCustomerPhotos(data?.customer_photos)
                }} className="!text-[10px] !h-[2rem] !rounded-full"  >Download Images</Button>
             </Div>
            )}
        </Div>
          )
        })}
        
      </Div>
      

      <Div className="w-full min-h-[2.5rem] border px-6  py-3 bg-white mt-2  flex flex-col" >
        <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Delivery Charge</Typography>
         <Typography className="text-[15px] text-gray-700" >₹{orderDetails?.price_details?.delivery_charge}</Typography>
        </Div>
        <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Items Amount(5)</Typography>
         <Typography className="text-[15px] text-gray-700" >₹{orderDetails?.price_details?.items_amount}</Typography>
        </Div>
        { orderDetails?.price_details.pm_offer !== 0 && (<Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Pay Online Discount</Typography>
         <Typography className="text-[15px] text-green-500" >₹{orderDetails?.price_details?.pm_offer}</Typography>
        </Div>)}
        { orderDetails?.coupen_details?.applied && <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Coupen Code</Typography>
         <Typography className="text-[15px] text-green-500" >{orderDetails?.coupen_details.code}, {orderDetails?.coupen_details.discount.type === "fixed" ? `₹${orderDetails?.coupen_details.discount.amount} OFF` : `%${orderDetails?.coupen_details.discount.amount} OFF`} </Typography>
        </Div>}
        <Div className="flex items-center gap-3" >
         <Typography className="text-[13px] text-gray-600 w-[8rem]" >Total Discount</Typography>
         <Typography className="text-[15px] text-green-500" >₹{orderDetails?.price_details?.total_discount}</Typography>
        </Div>
        <Div className="flex items-center gap-3 border-t pt-1 mt-1" >
         <Typography className="text-[14px] w-[8rem] font-medium" >Net Total Amount</Typography>
         <Typography className="text-[16px] font-medium" >₹{orderDetails?.price_details?.net_total}</Typography>
        </Div>
      </Div>

 

    </Div>}
    </>
  )
}
