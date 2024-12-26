"use client"

import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Div, InputField, SelectDropdown, Typography } from "@/interface/fragments";
import { EditProductTypes } from "@/types/dashboard/products";
import ReactSwitch from "react-switch";
import PMOffferImage from "../../../../../../public/settings/pm-offer.png"

type EditPMPriceOfferProps = {
    editProductData: EditProductTypes
    setEditProductData: Dispatch<SetStateAction<EditProductTypes>>
}

export default function EditPMPriceOffer({ editProductData, setEditProductData }: EditPMPriceOfferProps) {

    
    const options = [
        { label: "Cash on Delivery", value: "cod" },
        { label: "Online", value: "online" },
    ];

    const [defaultValue, setDefaultValue] = useState(options[1])

    useEffect(() => {
      if(editProductData.discount_based_pm.allow === false){
        return setDefaultValue(options[1])
      }
      if(editProductData.discount_based_pm.payment_method === "online"){
        setDefaultValue(options[1])
      }else{
        setDefaultValue(options[0])
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editProductData])
    


    const handleEnablePMPriceOffer = () => {
        setEditProductData((prevData) => ({
            ...prevData,
            discount_based_pm: {
                ...prevData.discount_based_pm,
                allow: !prevData.discount_based_pm.allow,
            }
        }))
    }

    const handleChangeSellingPrice = (e: ChangeEvent<HTMLInputElement>) => {
      setEditProductData((prevData) => ({
        ...prevData,
        discount_based_pm: {
          ...prevData.discount_based_pm,
          [e.target.name]: e.target.value
        }
      }))
    }

    const handleChangePaymentMethod = (e: any) => {
      setEditProductData((prevData) => ({
        ...prevData,
        discount_based_pm: {
          ...prevData.discount_based_pm,
          payment_method: e.value
        }
      }))
    }
    

  return (
    <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[10px] mt-[23px]">
      <Div className="flex justify-between">
        <Typography className="text-[13px]">
        Give discount based on payment method (optional)
        </Typography>
        <ReactSwitch
          width={38}
          height={20}
          boxShadow="0px 1px 5px #00000099"
          onColor="#333"
          checkedIcon={false}
          uncheckedIcon={false}
          checked={editProductData.discount_based_pm.allow}
          onChange={handleEnablePMPriceOffer}
        />
      </Div>
      <Div>
        <Typography className="text-[11px] md:mt-1">
        This helps boost your preferred payment method
        </Typography>
      </Div>
      {editProductData.discount_based_pm.allow && (
        <Div className="flex items-center justify-between gap-3" >
            {/* <Div className="flex flex-col mt-[12px] gap-[3px] w-full" >
            <Typography className="text-[13px] ml-1">Payment Method</Typography>
            <SelectDropdown
             options={options}
             defaultValue={defaultValue}
             setDefaultValue={setDefaultValue}
             onChange={handleChangePaymentMethod}
             className="w-full"
            />
            </Div> */}
            <Div className="flex flex-col mt-[12px] gap-[3px] w-full" >
             <Typography className="text-[13px] ml-1">Selling Price for {editProductData.discount_based_pm.payment_method === "online" ? "Online Payment" : "Cash on Delivery"}</Typography>
             <InputField
              name="selling_price"
              type="number"
              placeHolder="0.00"
              innerText="₹"
              innerTextStyle="left-3 mt-[3px]"
              containerStyle="w-full gap-[4px]"
              className="!w-full bg-gray-100 pl-[25px]"
              defaultValue={editProductData.discount_based_pm.selling_price === 0 ? undefined: editProductData.discount_based_pm.selling_price  }
              onChange={handleChangeSellingPrice}
            />
             </Div>
        </Div>
      )}
      <Div className="flex  items-center p-2 pb-0 mt-1">
        {/* <Image
          className="shadow-md w-full md:w-[15rem]"
          src={PMOffferImage}
          width={0}
          height={0}
          alt="additional message"
        /> */}
      </Div>
    </Div>
  );
}
