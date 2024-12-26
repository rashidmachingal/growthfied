"use client"

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Div, InputField, Span, Typography } from "@/interface/fragments";
import { EditProductTypes } from "@/types/dashboard/products";
import Popup from "@/interface/components/common/Popup";
import ReactSwitch from "react-switch";
import VariantsImage from "../../../../../../public/settings/variants.png"
import Image from "next/image";

type VariantsDetailsProps = {
    setEditProductData: Dispatch<SetStateAction<EditProductTypes>>
    editProductData: EditProductTypes
}

export default function VariantsDetails({ editProductData, setEditProductData }: VariantsDetailsProps) {

    const [variantsEnable, setVariantsEnable] = useState(false)
    const [variantsPopupOpen, setVariantsPopupOpen] = useState(false)
    const [variantsErrorMessage, setVariantErrorMessage] = useState({name: false, option: false})
    const [variantsEdit, setVariantsEdit] = useState(false)

    useEffect(() => {
      editProductData.variants.variant_name === "" ? setVariantsEnable(false) : setVariantsEnable(true)
    }, [editProductData])
    

    const handleEnableVariants = () => {
        if(variantsEnable === true){
          setVariantsEnable(false)
          setEditProductData((prevData) => ({
            ...prevData,
            variants: {
              variant_name: "",
              options: {
                option_one: "",
                option_two: "",
                option_three: "",
                option_four: ""
              },
              options_quantity: {
                option_one: "",
                option_two: "",
                option_three: "",
                option_four: ""
              }
            }
          }))
        }
        if(variantsEnable === false){
          setVariantsPopupOpen(true)
        }
      }
    
      const handleCreateVariants = () => {
        if(editProductData.variants.variant_name === ""){
          setVariantErrorMessage((prevData)=> ({
            ...prevData,
            name: true
          }))
          return
      }
    
        setVariantErrorMessage((prevData)=> ({
          ...prevData,
          name: false
        }))
    
        if (
          editProductData.variants.options.option_one === "" &&
          editProductData.variants.options.option_two === "" &&
          editProductData.variants.options.option_three === "" &&
          editProductData.variants.options.option_four === ""
        ) {
          setVariantErrorMessage((prevData)=> ({
            ...prevData,
            option: true
          }))
        }else{
          setVariantErrorMessage((prevData)=> ({
            name: false,
            option: false
          }))
          setVariantsEnable(true)
          setVariantsPopupOpen(false)
        }
      }
    
      const handleCloseVariants = () => {
        if(variantsEdit === false){
          setVariantsEnable(false) 
        setVariantsPopupOpen(false)
        setEditProductData((prevData) => ({
          ...prevData,
          variants: {
            variant_name: "",
            options: {
              option_one: "",
              option_two: "",
              option_three: "",
              option_four: ""
            },
            options_quantity: {
              option_one: "",
              option_two: "",
              option_three: "",
              option_four: ""
            }
          }
        }))
        }
      }
    
      const handleVariantChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.name === "variant_name"){
          setVariantErrorMessage((prevData) => ({
            ...prevData,
            name: false
          }))
          setEditProductData((prevData) => ({
            ...prevData,
            variants: {
              ...prevData.variants,
              variant_name: e.target.value
            }
          }))
        }else{
          setVariantErrorMessage((prevData) => ({
            ...prevData,
            option: false
          }))
          setEditProductData((prevData) => ({
            ...prevData,
            variants: {
              ...prevData.variants,
              options: {
                ...prevData.variants.options,
                [e.target.name] : e.target.value
              }
            }
          }))
        }
      }

      const handleVariantQuanityChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditProductData((prevData) => ({
          ...prevData,
          variants: {
            ...prevData.variants,
            options_quantity: {
              ...prevData.variants.options_quantity,
              [e.target.name] : e.target.value
            }
          }
        }))
      }

      const handleVariantEdit = () => {
        setVariantsEdit(true)
        setVariantsPopupOpen(true)
      }
  

  return (
    <Div className="mt-[20px] w-full bg-white rounded-[4px] px-[12px] pt-[8px] pb-[12px]">
      <Div className="flex justify-between">
        <Typography className="text-[13px]">Variants (optional)</Typography>
        <ReactSwitch
          width={38}
          height={20}
          boxShadow="0px 1px 5px #00000099"
          onColor="#333"
          checkedIcon={false}
          uncheckedIcon={false}
          checked={variantsEnable}
          onChange={handleEnableVariants}
        />
      </Div>
      <Typography className="text-[11px]">
        Enable if this product has different options like colour, size, etc
      </Typography>
      <Popup open={variantsPopupOpen} onClose={handleCloseVariants}>
        <Div className="w-[95vw] lg:w-[40vw] shadow  bg-white rounded-theme p-5 pt-4">
          <Div className="flex flex-col border-b pb-2">
            <Typography className="font-medium">{variantsEdit ? "Edit Variant": "Create Variant"}</Typography>
            <Typography className="text-[12px]" >You can add maxium 4 variants & You need to add quanity/stocks for each variants</Typography>
          </Div>
          <Div className="flex gap-5 w-full mt-[8px]">
            <Div className="w-[50%]">
              <Typography className="text-[13px]">
                Variant Name{" "}
                <Span className="text-[11px] text-gray-500">(eg. Color)</Span>
              </Typography>
              <InputField
                type="text"
                name="variant_name"
                placeHolder="eg. Color, Size"
                innerTextStyle="mt-[2px]"
                containerStyle="!w-full mt-3"
                onChange={handleVariantChange}
                className="w-full bg-gray-100 border-[#33333321]"
                defaultValue={editProductData.variants.variant_name}
                invalid={variantsErrorMessage.name}
                errorMessage="*Please enter variant name"
              />
            </Div>
          </Div>
          <Div className="flex mt-3 gap-2" >
          <Div className="w-full">
              <Typography className="text-[13px]">
                Options{" "}
                <Span className="text-[11px] text-gray-500">(eg. S, M, L)</Span>
              </Typography>
              <InputField
                type="text"
                name="option_one"
                placeHolder="eg. L"
                innerTextStyle="mt-[2px]"
                containerStyle="!w-full mt-3"
                onChange={handleVariantChange}
                className="w-full bg-gray-100 border-[#33333321] text-[14px]"
                defaultValue={editProductData.variants.options.option_one}
                invalid={variantsErrorMessage.option}
                errorMessage="*Please enter option"
              />
              <InputField
                type="text"
                name="option_two"
                onChange={handleVariantChange}
                placeHolder="eg. M"
                innerTextStyle="mt-[2px]"
                containerStyle="!w-full mt-3"
                defaultValue={editProductData.variants.options.option_two}
                className="w-full bg-gray-100 border-[#33333321] text-[14px]"
              />
              <InputField
                type="text"
                name="option_three"
                onChange={handleVariantChange}
                placeHolder="eg. X"
                innerTextStyle="mt-[2px]"
                containerStyle="!w-full mt-3"
                defaultValue={editProductData.variants.options.option_three}
                className="w-full bg-gray-100 border-[#33333321] text-[14px]"
              />
              <InputField
                type="text"
                name="option_four"
                onChange={handleVariantChange}
                placeHolder="eg. XL"
                innerTextStyle="mt-[2px]"
                containerStyle="!w-full mt-3"
                defaultValue={editProductData.variants.options.option_four}
                className="w-full bg-gray-100 border-[#33333321] text-[14px]"
              />
            </Div>
            <Div >
              <Typography className="text-[13px]">
                Quantity
              </Typography>
              <InputField
                type="number"
                name="option_one"
                placeHolder="10"
                innerTextStyle="mt-[2px]"
                containerStyle="!w-full mt-3"
                onChange={handleVariantQuanityChange}
                className="w-[5rem] bg-gray-100 border-[#33333321] text-[14px]"
                defaultValue={editProductData.variants?.options_quantity?.option_one}
              />
              <InputField
                type="number"
                name="option_two"
                placeHolder="10"
                innerTextStyle="mt-[2px]"
                containerStyle="!w-full mt-3"
                onChange={handleVariantQuanityChange}
                className="w-[5rem] bg-gray-100 border-[#33333321] text-[14px]"
                defaultValue={editProductData.variants?.options_quantity?.option_two}
              />
              <InputField
                type="number"
                name="option_three"
                placeHolder="10"
                innerTextStyle="mt-[2px]"
                containerStyle="!w-full mt-3"
                onChange={handleVariantQuanityChange}
                className="w-[5rem] bg-gray-100 border-[#33333321] text-[14px]"
                defaultValue={editProductData.variants?.options_quantity?.option_three}
              />
              <InputField
                type="text"
                name="option_four"
                placeHolder="10"
                innerTextStyle="mt-[2px]"
                containerStyle="!w-full mt-3"
                onChange={handleVariantQuanityChange}
                className="w-[5rem] bg-gray-100 border-[#33333321] text-[14px]"
                defaultValue={editProductData.variants?.options_quantity?.option_four}
              />
            </Div>
          </Div>
          <Div className="mt-5 flex justify-end gap-3">
            {variantsEdit === false && <Button
              onClick={handleCloseVariants}
              className="!h-[2rem] w-[5rem] border-black !bg-gray-200 hover:!bg-gray-300 !text-black"
            >
              Close
            </Button>}
            <Button className="!h-[2rem]" onClick={handleCreateVariants}>
              {variantsEdit ? "Edit Variant" :"Create Variant"}
            </Button>
          </Div>
        </Div>
      </Popup>
      {variantsEnable && (
        <Div className="mt-[10px]">
          <Div className="flex justify-between items-center">
            <Typography className="text-[14px] font-medium">
              {editProductData.variants.variant_name}
            </Typography>
            <Button onClick={handleVariantEdit} className="!h-[1.5rem] !rounded-[3px] border-black !bg-gray-200 hover:!bg-gray-300 !text-black">
              Edit
            </Button>
          </Div>
          <Div className="flex gap-2 mt-3">
            {editProductData.variants.options.option_one !== "" && (
              <Button className="!bg-gray-200 !text-black !min-w-[3rem] !h-[1.9rem]">
                {editProductData.variants.options.option_one}
              </Button>
            )}
            {editProductData.variants.options.option_two !== "" && (
              <Button className="!bg-gray-200 !text-black !min-w-[3rem] !h-[1.9rem]">
                {editProductData.variants.options.option_two}
              </Button>
            )}
            {editProductData.variants.options.option_three !== "" && (
              <Button className="!bg-gray-200 !text-black !min-w-[3rem] !h-[1.9rem]">
                {editProductData.variants.options.option_three}
              </Button>
            )}
            {editProductData.variants.options.option_four !== "" && (
              <Button className="!bg-gray-200 !text-black !min-w-[3rem] !h-[1.9rem]">
                {editProductData.variants.options.option_four}
              </Button>
            )}
          </Div>
        </Div>
      )}
      <Div className="flex  items-center p-2 mt-1" >
          <Image className="shadow-md w-full md:w-[25rem]" src={VariantsImage} width={0} height={0} alt="additional message" />
       </Div>
    </Div>
  );
}
