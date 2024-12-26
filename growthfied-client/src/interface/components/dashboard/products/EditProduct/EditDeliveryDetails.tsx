"use client"

import Link from "next/link";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Div, InputField, RadioButton, Span, Typography } from "@/interface/fragments";
import { EditProductTypes } from "@/types/dashboard/products";
import { LoadingIcon, SettingsOutlineIcon } from "@/interface/icons";
import { getDefaultDeliveryCharge } from "@/@api/dashboard/settings.api";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

type DeliveryDetailsProps = {
    editProductData: EditProductTypes
    setEditProductData: Dispatch<SetStateAction<EditProductTypes>>
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
    formErrors: any
}

export default function EditDeliveryDetails({ setEditProductData, handleInputChange, formErrors, editProductData }: DeliveryDetailsProps) {

    const { update_unauthorized } = useUserStore()

    const [quantityType, setQuantityType] = useState<"unlimited" | "fixed" >("unlimited")
    const [deliveryChargeType, setDeliveryChargeType] = useState<"free" | "enable" >("free")
    const [deliveryCharge, setDeliveryCharge] = useState<number>()
    const [deliveryChargeloading, setDeliveryChargeLoading] = useState(true)
    const [minimumLimit, setMinimumLimit] = useState<number>()
    const [maximumLimit, setMaximumLimit] = useState<number>()

    const fetchDeliveryCharge = async () => {
      try {
        const res = await getDefaultDeliveryCharge()
        setDeliveryCharge(res.data.default_delivery_charge)
        setDeliveryChargeLoading(false)
      } catch (error: any) {
        if (error.response.status === 401) {
          const cookies = new Cookies();
          cookies.remove("token", { path: "/" });
          update_unauthorized()
        }
        setDeliveryChargeLoading(false)
      }
    }

    useEffect(() => {
      editProductData.quantity === "unlimited" ? setQuantityType("unlimited") : setQuantityType("fixed")
      editProductData.delivery_charge === "free" && setDeliveryChargeType("free")
      editProductData.delivery_charge === "enable" && setDeliveryChargeType("enable")
      setMinimumLimit(editProductData.limit_per_order.minimum)
      setMaximumLimit(editProductData.limit_per_order.maximum)
      fetchDeliveryCharge()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editProductData])

    const handleLimitChange = (e:  ChangeEvent<HTMLInputElement>) => {
        setEditProductData((prevData) => ({
          ...prevData,
          limit_per_order: {
            ...prevData.limit_per_order,
            [e.target.name]: Math.abs(Number(e.target.value))
          }
        }))
    }

    const handleQuantityChange = () => {
        setQuantityType("unlimited")
        setEditProductData((prevData) => ({
          ...prevData,
          quantity: "unlimited"
        }))
    }

    const handleDeliveryChargeChange = (settings: "free" | "enable") => {
      setDeliveryChargeType(settings)
      setEditProductData((prevData) => ({
        ...prevData,
        delivery_charge: settings
      }))
  }

  return (
    <Div className="mt-[20px] w-full bg-white rounded-[4px] px-[12px] pt-[8px] pb-[12px]">
      <Typography className="text-[13px] mt-[14px]">
        Total available stocks
      </Typography>
      <Span className="text-[13px] font-[300]" >if you have variants manage stocks at variants option</Span>
      <Div className="flex items-center gap-3 mt-2">
        <Div
          onClick={handleQuantityChange}
          className="flex gap-1 items-center"
        >
          <RadioButton
            checked={quantityType === "unlimited" ? true : false}
            onChange={handleQuantityChange}
          />
          <Typography className="text-[12px] cursor-pointer">
            Unlimted
          </Typography>
        </Div>
        <Div
          onClick={() => setQuantityType("fixed")}
          className="flex gap-1 items-center"
        >
          <RadioButton
            checked={quantityType === "fixed" ? true : false}
            onChange={()=> {}}
          />
          <Typography className="text-[12px] cursor-pointer">Fixed</Typography>
        </Div>
      </Div>
      {quantityType === "fixed" && (
        <InputField
          type="number"
          name="quantity"
          placeHolder="0.00"
          containerStyle="!w-full mt-2"
          className=" w-full bg-gray-100 mt-[2px]"
          defaultValue={editProductData.quantity}
          onChange={handleInputChange}
          invalid={!!formErrors?.quantity}
          errorMessage={formErrors?.quantity}
        />
      )}

      <Div className="mt-[23px] border-t pt-3" >
       <Typography className="text-[13px] ml-1">Number of days it takes to delivery</Typography>
       <Typography className="text-[13px] ml-1 font-light">If an order has more than two items, longest delivery time will be shown to customer</Typography>
       <InputField
        name="delivery_days"
        type="number"
        placeHolder="0.00"
        containerStyle="!w-full"
        className="w-full bg-gray-100 mt-[2px]"
        value={editProductData.delivery_days}
        onChange={handleInputChange}
        invalid={!!formErrors?.delivery_days}
        errorMessage={formErrors?.delivery_days}
      />
      </Div>

      <Typography className="text-[13px] mt-[20px] border-t pt-3">Delivery Charge</Typography>
      <Div className="flex items-center gap-3 mt-2">
        <Div onClick={()=> handleDeliveryChargeChange("free")} className="flex gap-1 items-center">
          <RadioButton
            checked={deliveryChargeType === "free"}
            onChange={()=> {}}
          />
          <Typography className="text-[12px] cursor-pointer">
            Free Delivery
          </Typography>
        </Div>
        <Div onClick={()=> handleDeliveryChargeChange("enable")} className="flex gap-1 items-center">
          <RadioButton
            checked={deliveryChargeType === "enable"}
            onChange={() => {}}
          />
          <Typography className="text-[12px] cursor-pointer">
            Enable Delivery Fee
          </Typography>
        </Div>
      </Div>
      
      { deliveryChargeType === "enable" && (<Div className="mt-2" >
        <Typography className="text-[14px] flex items-center gap-1 flex-wrap" >
          Your delivery charge is 
          { deliveryChargeloading ? <LoadingIcon className="animate-spin !w-[15px] !h-[15px]" /> : <Span className="font-medium" >₹{deliveryCharge}</Span>},
          you can change it on
          <Link target="_blank" href="/dashboard/settings/delivery-charge" className="cursor-pointer underline" >settings</Link> 
          <SettingsOutlineIcon/>
        </Typography>
      </Div>)}

      <Typography className="mt-[23px] text-[13px] border-t pt-3">
        Limit Per Order (optional)
      </Typography>
      <Div className="flex items-center gap-3">
        <InputField
          label="Minimum"
          name="minimum"
          type="number"
          placeHolder="0.00"
          containerStyle="!w-full mt-2"
          defaultValue={minimumLimit}
          onChange={handleLimitChange}
          invalid={!!formErrors?.maximum}
          errorMessage={formErrors?.maximum}
          className=" w-full bg-gray-100 mt-[2px]"
        />
        <Span className="w-[20px] h-[2px] bg-gray-200 rounded-full mt-[26px]"></Span>
        <InputField
          label="Maximum"
          name="maximum"
          type="number"
          placeHolder="0.00"
          containerStyle="!w-full mt-2"
          defaultValue={maximumLimit}
          onChange={handleLimitChange}
          invalid={!!formErrors?.minimum}
          errorMessage={formErrors?.minimum}
          className=" w-full bg-gray-100 mt-[2px]"
        />
      </Div>
    </Div>
  );
}
