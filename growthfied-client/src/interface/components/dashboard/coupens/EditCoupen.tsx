"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, InputField, RadioButton, Typography } from "@/interface/fragments";
import { ErrorPopup, PageHeader, SelectProductsPopup } from "@/interface/components";
import { LoadingIcon } from "@/interface/icons";
import { EditCoupenTypes } from "@/types/dashboard/coupens";
import { formValidation } from "@/utils/formValidation";
import { getSingleCoupen, updateCoupen } from "@/@api/dashboard/coupens.api";
import { useEditCoupenDefaultDataStore } from "@/zustand/dashboard/coupenStore";
import { getDefaultDate } from "@/utils";
import { toast } from "sonner";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";


export default function EditCoupen() {

  const defaultEditCoupenData = useEditCoupenDefaultDataStore()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { update_unauthorized } = useUserStore()

  const InitialEditCoupenData = {
    coupen_code: "",
    discount: {
        type: "fixed",
        value: 0
    },
    applies: {
        type: "any",
        products: []
    },
    minimum: 0,
    end_date: "",
    count: 100
  }

  const [editCoupenData, setEditCoupenData] = useState<EditCoupenTypes>(InitialEditCoupenData)
  const [appliesType, setAppliesType] = useState< "any" | "specific" >("any")
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">("fixed")
  const [formErrors, setFormErrors] = useState<any>({});
  const [isFormErrors, setIsFormError] = useState(false)
  const [errorType, setErrorType] = useState<"client" | "server">("client")
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [isCustomError, setIsCustomError] = useState(false)
  const [loading, setLoading] = useState(false)
  const currentPage = searchParams.get("p") ?? "1"

  // set default data
  useEffect(() => {
    const getDefaultEditCoupenData = async () => {
      if(defaultEditCoupenData.fetch_status === true){
        let parts = pathname.split('/');
        let Id = parts[parts.length - 1];

        try {
          const res = await getSingleCoupen(Id)
        
        setEditCoupenData((prevData) => ({
          ...prevData,
          ...res.data,
        }))

        if(defaultEditCoupenData.update_edit_coupen_default_data){
            defaultEditCoupenData.update_edit_coupen_default_data(res.data)
        }

        setDiscountType(res.data?.discount?.type)

        if(defaultEditCoupenData.update_fetch_status) {
          defaultEditCoupenData.update_fetch_status(false);
        }
        } catch (error: any) {
          if (error.response.status === 401) {
            const cookies = new Cookies();
            cookies.remove("token", { path: "/" });
            update_unauthorized()
          }
        }
        
      }else{
        setEditCoupenData(defaultEditCoupenData)
        if(defaultEditCoupenData.discount?.type === "fixed"){
          setDiscountType(defaultEditCoupenData.discount?.type)
        }
        if(defaultEditCoupenData.discount?.type === "percentage"){
          setDiscountType(defaultEditCoupenData.discount?.type)
        }
      }
    }

    getDefaultEditCoupenData()
  }, [defaultEditCoupenData, pathname, update_unauthorized])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    if (formErrors !== undefined) {
      const { [e.target.name]: _, ...rest } = formErrors;
      setFormErrors(rest);
    }

    if(e.target.name === "discount"){
      setEditCoupenData((prevData) => ({
        ...prevData,
        discount: {
          type: discountType,
          value: Number(e.target.value)
        }
      }));
    }else{
      setEditCoupenData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleAppliesChange = (type: "any" | "specific") => {
    setAppliesType(type)
    setEditCoupenData((prevData) => ({
      ...prevData,
      applies: {
        type: type,
        products: prevData.applies?.products
      }
    }))
  }

  const additionalFormValidation = () => {
    if(editCoupenData.discount?.value === 0){
      return { discount: "*Please enter discount" }
    }
  }

  const handleUpdateCoupen = async () => {
    // form validation
    const newFormErrors = formValidation(editCoupenData, ["fetch_status", "used", "__v"]);
    const additionalForm = additionalFormValidation()
    const finalFormErrors = { ...newFormErrors, ...additionalForm}
    setFormErrors(finalFormErrors)
    const errorLength = Object.keys(finalFormErrors).length;
    if (errorLength > 0) {
      setErrorType("client")
      setIsFormError(true)
      return
    }
    setLoading(true)

    try {
      if(editCoupenData._id) await updateCoupen(editCoupenData._id, editCoupenData)
      toast.success("Coupen edited successfully")
      router.push(`/dashboard/coupens?p=${currentPage}`)
      setLoading(false)
    } catch (error: any) {
      setErrorType("server")
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
      }
      if(error?.response.status === 409){
        setErrorMessage("This coupen is already exist!, please choose another name")
        toast.error("This coupen is already exist!")
        setIsFormError(true)
        setIsCustomError(true)
        setLoading(false)
      }else{
        setLoading(false)
        setIsFormError(true)
        toast.error("Coupen updation failed, try again")
      }
    }
  }

  return (
    <>
    <ErrorPopup 
      server_title="Creating coupen"
      client_title="coupen"
      type={errorType} 
      open={isFormErrors}
      onClose={()=> setIsFormError(false)}
      formErrors={formErrors}
      custom_error_message={errorMessage}
      custom_error={isCustomError}
    />
    <SelectProductsPopup 
       open={appliesType === "specific"} 
       onClose={()=> handleAppliesChange("any")}
    />
    <PageHeader title="Edit Coupen" className="sticky bg-[#f1f1f1] border-b border-[#eae8e8] py-[10px] top-[67px] z-[49]">
      <Div className="hidden mmd:flex gap-2">
        <Button onClick={handleUpdateCoupen} >
         {loading ? <LoadingIcon className="animate-spin" /> : "Edit Coupen"}
        </Button>
      </Div>
    </PageHeader>
      <Div className="mt-4 lg:mt-3 flex flex-col lg:flex-row lg:items-start gap-[25px] pb-[5rem]" >

        {/* skelton */}
        {defaultEditCoupenData.fetch_status === true && (
          <Div className="w-full h-[50vh] flex items-center flex-col justify-center" >
             <LoadingIcon className="animate-spin !w-[1.1rem] !h-[1.1rem]" />
             <Typography className="text-[12px] mt-[6px]" >loading...</Typography>
          </Div>
        )}

        {/* left side */}
        {defaultEditCoupenData.fetch_status === false && (
           <Div className="w-full lg:w-[67%]" >
             <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[3px]" >
                <InputField
                   type="text"
                   label="Coupen Code"
                   name="coupen_code"
                   placeHolder="Eg: OFF2024"
                   containerStyle="mt-3"
                   inputContainerStyle="mt-[2px]"
                   className="w-full bg-gray-100 mt-[2px] uppercase"
                   defaultValue={defaultEditCoupenData.coupen_code}
                   onChange={handleInputChange}
                   invalid={!!formErrors?.coupen_code}
                   errorMessage={formErrors?.coupen_code}
                  />
       

                <Div className="mt-[20px]" >
                  <Typography className="text-[13px]" >Discount Amount</Typography>
                   <Div className="flex items-center gap-3 mt-2" >
                    <Div className="flex gap-1 items-center cursor-pointer" onClick={() => {
                      setDiscountType("fixed")
                      setEditCoupenData((prevData) => ({
                        ...prevData,
                        discount: {
                          type: "fixed",
                          value: Number(prevData.discount?.value)
                        }
                      }))
                    }} >
                     <RadioButton name="discount_type" checked={discountType === "fixed" ? true : false} onChange={() => {}}  />
                     <Typography className="text-[12px]" >Fixed</Typography>
                    </Div>
                    <Div className="flex gap-1 items-center cursor-pointer" onClick={() => {
                      setDiscountType("percentage")
                      setEditCoupenData((prevData) => ({
                        ...prevData,
                        discount: {
                          type: "percentage",
                          value: Number(prevData.discount?.value)
                        }
                      }))
                    }} >
                     <RadioButton name="discount_type" checked={discountType === "percentage" ? true : false} onChange={() => {}} />
                     <Typography className="text-[12px]" >Percentage</Typography>
                    </Div>
                   </Div>
                     <InputField
                      type="number"
                      name="discount"
                      placeHolder="0.00"
                      innerText={discountType === "fixed" ? "₹" : "%"}
                      innerTextStyle={`mt-[2px] ${discountType === "fixed" ? "pl-3 ": "pl-2"}`}
                      containerStyle="!w-full mt-2"
                      className="w-full bg-gray-100 pl-[25px]"
                      defaultValue={defaultEditCoupenData.discount?.value}
                      onChange={handleInputChange}
                      invalid={!!formErrors?.discount}
                      errorMessage={formErrors?.discount}
                   />
                  </Div>

                <Div className="mt-[20px]" >
                  <Typography className="text-[13px]" >Minimum Order Amount (optional)</Typography>
                     <InputField
                      type="number"
                      name="minimum"
                      placeHolder="0.00"
                      innerText="₹"
                      innerTextStyle={`mt-[2px] pl-3`}
                      containerStyle="!w-full mt-2"
                      className="w-full bg-gray-100 pl-[25px]"
                      defaultValue={defaultEditCoupenData.minimum}
                      onChange={handleInputChange}
                   />
                  </Div>
       
                  <Div className="mt-[20px]" >
                   <Typography className="text-[14px]" >This coupen code applies to all of your product</Typography>
                   {/* <Div className="flex items-center gap-3 mt-2" >
                    <Div className="flex gap-1 items-center cursor-pointer" onClick={()=> handleAppliesChange("any")}  >
                     <RadioButton name="shipping_fee" checked={appliesType === "any" ? true : false} onChange={()=> {}} />
                     <Typography className="text-[12px]" >Any Products</Typography>
                    </Div>
                    <Div className="flex gap-1 items-center cursor-pointer" onClick={()=> handleAppliesChange("specific")} >
                     <RadioButton name="shipping_fee" checked={appliesType === "specific" ? true : false} onChange={()=> {}} />
                     <Typography className="text-[12px]" >Specifc Products</Typography>
                    </Div>
                   </Div> */}
                  </Div>
       
                  {/* <Div className="mt-[1rem] flex-col gap-[2rem]" >
                   <Div className="w-full flex gap-[1rem] border shadow px-[10px] pr-[1rem] rounded-[5px] mt-[1rem]" >
                   <Div className="flex items-center w-full justify-between" >
                   <Div className="text-center py-2 hover:underline">
                   <Div className="flex items-center gap-3 pr-2">
                     <img
                       className="w-10"
                       src="https://rash-cart.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F2.9419a980.png&w=640&q=75"
                       alt=""
                     />
                     <Typography className="text-[11px] cursor-pointer">
                       Alen Solly Cotton Short Sleev T-Shirt Gray 500
                     </Typography>
                   </Div>
                   </Div>
                   <Div>
                     <Typography className="text-[15px]" >₹198</Typography>
                   </Div>
                   </Div>
                   <Div className="flex items-center" >
                     <DeleteIcon className="stroke-gray-500 hover:stroke-black" />
                   </Div>
                   </Div>
                  </Div> */}
                 </Div>
          </Div>
        ) }
     

        {/* right side */}
        {defaultEditCoupenData.fetch_status === false && (
         <Div className="w-full lg:w-[33%]" >
            <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[3px]" >
              <InputField
                 label="End Date"
                 type="date"
                 name="end_date"
                 innerTextStyle="mt-[2px]"
                 containerStyle="!w-full mt-3"
                 className="w-full bg-gray-100"
                 value={getDefaultDate(editCoupenData.end_date)}
                 onChange={handleInputChange}
                 invalid={!!formErrors?.end_date}
                 errorMessage={formErrors?.end_date}
               />
               <Div className="mt-3" >
                 <Typography className="text-[13px]" >Number of coupens</Typography>
                 <Typography className="text-[10px]" >Number of times this coupen can be used in total</Typography>
                 <InputField
                   type="number"
                   name="count"
                   placeHolder="0.00"
                   innerTextStyle="mt-[2px]"
                   containerStyle="!w-full"
                   className="w-full bg-gray-100 mt-[5px]"
                   defaultValue={defaultEditCoupenData.count}
                   onChange={handleInputChange}
                   invalid={!!formErrors?.count}
                   errorMessage={formErrors?.count}
                 />
               </Div>
            </Div>
           </Div>
        )}

      </Div>

      <Div className="mmd:hidden flex items-center justify-center gap-2 w-full fixed left-0 bottom-0 h-[4.5rem] bg-white z-[50]">
        <Button onClick={handleUpdateCoupen} className="w-[90%] h-[60%] cursor-not-allowed">
         {loading ? <LoadingIcon className="animate-spin" /> : "Edit Coupen"}
        </Button>
      </Div>
    </>
  );
}
