"use client"

// fragments
import { Button, Div, InputField, RadioButton, TextArea, Typography } from "@/interface/fragments";

// components
import { PageHeader } from "@/interface/components";


export default function EditBankAccount() {

  return (
    <>
      <PageHeader title="Edit Payment Info" className="sticky bg-[#f1f1f1] border-b border-[#eae8e8] py-[10px] top-[67px] z-[49]">
      <Div className="hidden mmd:flex gap-2">
        <Button className="!bg-[#dcdcdc] cursor-not-allowed">Save</Button>
      </Div>
    </PageHeader>

   <Div className="flex gap-4 flex-col mmd:flex-row pb-[8rem]" >
   
   <Div className="mt-4 w-full rounded-theme bg-white p-3 pt-2 pb-[2rem]" >
      <Typography className="font-medium" >Personal Information</Typography>
      <Div className="mt-[8px]" >
        <InputField label="Your Full Name" placeHolder="Enter Your Full Name" type="text" className="w-full text-[14px] mt-[2px] bg-gray-100" />
        <InputField label="Phone Number" type="number" placeHolder="Phone Number" innerText="+91" innerTextStyle="mt-[3px] border-r pr-[5px]" containerStyle="w-full mt-2" className="!w-full bg-gray-100 mt-[2px] pl-[51px]" />
        <TextArea label="Your Address" placeHolder="Enter Your Address" containerStyle="mt-2" className="w-full text-[14px] mt-[2px] bg-gray-100 !h-[9.5rem]" />
      </Div>
    </Div>

    <Div className="mt-4 w-full rounded-theme bg-white p-3 pt-2 pb-[2rem]" >
      <Typography className="font-medium" >Your Payment Details</Typography>
      <Div className="mt-[8px]" >
      <Div className="flex items-center gap-3 mt-2" >
             <Div className="flex gap-1 items-center" >
              <RadioButton name="available_quanity" />
              <Typography className="text-[12px]" >Google Pay</Typography>
             </Div>
             <Div className="flex gap-1 items-center" >
              <RadioButton name="available_quanity" />
              <Typography className="text-[12px]" >Bank Account</Typography>
             </Div>
            </Div>
        <InputField label="Full Name on Bank Account" placeHolder="Enter Your Full Name on Bank Account" type="text" containerStyle="mt-[8px]" className="w-full text-[14px] mt-[2px] bg-gray-100" />
        <InputField label="Bank Name" placeHolder="Enter Bank Name eg: Feder Bank" type="text" containerStyle="mt-2" className="w-full text-[14px] mt-[2px] bg-gray-100" />
        <InputField label="IFSC Code" placeHolder="Enter IFSC Code" type="text" containerStyle="mt-2" className="w-full text-[14px] mt-[2px] bg-gray-100" />
        <InputField label="Account Number" placeHolder="Enter Account Number" type="text" containerStyle="mt-2" className="w-full text-[14px] mt-[2px] bg-gray-100" />
        <InputField label="Re-Type Account Number" placeHolder="Re-Type Account Number" type="text" containerStyle="mt-2" className="w-full text-[14px] mt-[2px] bg-gray-100" />
      </Div>
    </Div>
   </Div>

      <Div className="mmd:hidden flex items-center justify-center gap-2 w-full fixed left-0 bottom-0 h-[4.5rem] bg-white z-[50]">
        <Button className="!bg-[#dcdcdc] w-[90%] h-[60%] cursor-not-allowed">Create Product</Button>
      </Div>
    </>
  );
}
