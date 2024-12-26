"use client"

import { useEffect, useState } from "react";
import { AlertText, EnterTrackInfo, TrackDetails } from "@/interface/components";
import { Div, Section } from "@/interface/fragments";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { formValidation } from "@/utils/formValidation";
import { trackOrder } from "@/@api/store/orders.api";

export default function EnterTrackTemplate() {

  const searchParams = useSearchParams();
  const params = useParams()

  const [isSubmited, setIsSubmited] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false)
  const [inputData, setInputData] = useState({ phone_number: "", order_id: "" });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<any>();
  const [trackingDetails, setTrackingDetails] = useState<any>()

  useEffect(() => {
    const ph = searchParams.get("ph");
    const orderId = searchParams.get("order_id");

    if (ph && orderId) {
      setInputData({
        phone_number: ph,
        order_id: orderId,
      })
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchTrackingDetails = async () => {
     const newFormErrors = formValidation(inputData);
     setFormErrors(newFormErrors);
     const errorLength = Object.keys(newFormErrors).length;
     if (errorLength > 0) return;
    try {
      setLoading(true);
      const res = await trackOrder({ ...inputData, store_name: params?.username})
      if(res.data.tracking_details.custom_tracking_url.applied){
        window.location = res.data.tracking_details.custom_tracking_url.url
        return
      }
      setTrackingDetails(res.data.tracking_details)
      setIsSubmited(true);
      setIsAvailable(true)
      setLoading(false);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setIsSubmited(false);
        toast.error("Order not found!")
        setLoading(false)
        return 
      }
      setLoading(false)
      console.log(error)
      toast.error("Something Went Wrong");
    }
  };

  return (
    <Section className="px-[1.3rem] md:px-[8rem] xl:px-[15rem] mt-[5.2rem] md:mt-[6rem] lg:mt-2">
      <Div className="flex flex-col items-center">
        { isAvailable === false && (<EnterTrackInfo
          setInputData={setInputData}
          inputData={inputData}
          fetchTrackingDetails={fetchTrackingDetails}
          loading={loading}
          formErrors={formErrors}
        />)}
      </Div>

      { isAvailable && isSubmited && (
        <TrackDetails 
          setIsSubmited={setIsSubmited} 
          setIsAvailable={setIsAvailable}
          tracking_details={trackingDetails}
        />
      )}

      { !isAvailable && isSubmited && (
        <AlertText
         className="mt-[2.5rem]"
         text="Order Not Found!"
         variant="danger"
        />
      )}
    </Section>
  );
}
