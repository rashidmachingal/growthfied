"use client";

import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  Button,
  Div,
  InputField,
  TextArea,
  Typography,
  VanilaSelect,
} from "@/interface/fragments";
import { CheckoutAddressType } from "@/types/store/checkout";
import { formValidation } from "@/utils/formValidation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CheckoutAddressProps = {
  setStep: Dispatch<SetStateAction<"delivery_address" | "payment_method">>;
  checkoutAddress: CheckoutAddressType
  setCheckoutAddress: Dispatch<SetStateAction<CheckoutAddressType>>
};

const states = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
];

export default function CheckoutAddress({ setStep, checkoutAddress, setCheckoutAddress }: CheckoutAddressProps) {
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [formErrors, setFormErrors] = useState<any>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (formErrors !== undefined) {
      const { [e.target.name]: _, ...rest } = formErrors;
      setFormErrors(rest);
    }
    setCheckoutAddress((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCheckoutAddress((prevData) => ({
      ...prevData,
      state: e.target.value,
    }));
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )
  

  const handleConfirmAddress = () => {
    const newFormErrors = formValidation(checkoutAddress, ["landmark"]);
    setFormErrors(newFormErrors);
    const errorLength = Object.keys(newFormErrors).length;
    if (errorLength > 0) return;
    router.push(pathname + '?' + createQueryString('step', 'pm'))
    setStep("payment_method");
    localStorage.setItem("checkoutAddress", JSON.stringify(checkoutAddress))
  };

  return (
    <Div className="w-full flex flex-col items-center">
      <Typography className="font-medium">Enter Shipping Address</Typography>

      <Div className="w-[90%] md:w-[30rem] mt-4">
        <Div className="flex flex-col-reverse md:flex-row gap-2 w-full">
          <InputField
            onChange={handleChange}
            name="full_name"
            type="text"
            label="Full Name"
            placeHolder="Full Name"
            containerStyle="w-full"
            className="w-full !h-[2.6rem] text-[14px] mt-[3px] bg-white"
            invalid={!!formErrors?.full_name}
            errorMessage={formErrors?.full_name}
            defaultValue={checkoutAddress.full_name}
          />
          <InputField
            onChange={handleChange}
            name="email"
            type="email"
            label="Email"
            placeHolder="Enter Email"
            containerStyle="w-full"
            className="w-full !h-[2.6rem] text-[14px] mt-[3px] bg-white"
            invalid={!!formErrors?.email}
            errorMessage={formErrors?.email}
            defaultValue={checkoutAddress.email}
          />
        </Div>

        <Div className="flex flex-col md:flex-row mt-2 gap-2">
          <InputField
            onChange={handleChange}
            name="mobile_number"
            type="number"
            label="Phone Number"
            placeHolder="Phone Number"
            containerStyle="w-full"
            className="w-full !h-[2.6rem] text-[14px] mt-[3px] bg-white pl-[2.5rem]"
            innerText="+91"
            innerTextStyle="text-[14px] top-[12px] left-[5px] border-r pr-[5px]"
            invalid={!!formErrors?.mobile_number}
            errorMessage={formErrors?.mobile_number}
            defaultValue={checkoutAddress.mobile_number}
          />
          <InputField
            onChange={handleChange}
            name="pincode"
            type="number"
            label="Pincode"
            placeHolder="Pincode"
            className="w-full !h-[2.6rem] text-[14px] mt-[3px] bg-white"
            containerStyle="w-full"
            invalid={!!formErrors?.pincode}
            errorMessage={formErrors?.pincode}
            defaultValue={checkoutAddress.pincode}
          />
        </Div>

        <TextArea
          onChange={handleChange}
          name="address"
          label="Address"
          placeHolder="Enter Your Address"
          className="md:h-[2.6rem] text-[14px] w-full bg-white !h-[3rem]"
          containerStyle="mt-2"
          invalid={!!formErrors?.address}
          errorMessage={formErrors?.address}
          defaultValue={checkoutAddress.address}
        />

        <Div className="flex flex-col md:flex-row items-center justify-between w-full gap-2">
          <InputField
            onChange={handleChange}
            name="city"
            type="text"
            label="City/District/Town"
            placeHolder="City/District/Town"
            className="!h-[2.6rem] text-[14px] w-full mt-[3px] bg-white"
            containerStyle="w-full"
            invalid={!!formErrors?.city}
            errorMessage={formErrors?.city}
            defaultValue={checkoutAddress.city}
          />
          <InputField
            onChange={handleChange}
            name="landmark"
            type="text"
            label="Landmark (Optional)"
            placeHolder="Landmark"
            className="!h-[2.6rem] text-[14px] w-full mt-[3px] bg-white"
            containerStyle="w-full"
            invalid={!!formErrors?.landmark}
            errorMessage={formErrors?.landmark}
            defaultValue={checkoutAddress.landmark}
          />
        </Div>

        <Div className="flex items-center justify-between w-full gap-2 mt-2">
          <VanilaSelect
            onChange={handleStateChange}
            value={checkoutAddress.state}
            options={states}
            label="State"
            containerStyle="!w-full"
            className="bg-white text-[12px] mt-[2px]"
          />
          <InputField
            disabled
            type="text"
            label="Country"
            placeHolder="India"
            defaultValue="India"
            className="w-full text-[13px] mt-[3px] bg-white"
            containerStyle="w-full"
          />
        </Div>

        <Button onClick={handleConfirmAddress} className="mt-3 w-full">
          Confirm Address
        </Button>
      </Div>
    </Div>
  );
}
