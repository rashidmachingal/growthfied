"use client";

import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, Typography } from "@/interface/fragments";
import { PageHeader, ErrorPopup, EditTitleDescription, EditPriceDetails, EditImagesDetails, EditDeliveryDetails, EditVariantsDetails, EditAdvancedOptions, EditStatusDetails, EditCategoriesDetails, EditPaymentMethods, EditShareLinkDetails, EditSeoDetails, EditPMPriceOffer } from "@/interface/components";
import { CreateProductTypes, EditProductTypes } from "@/types/dashboard/products";
import { formValidation } from "@/utils/formValidation";
import { editProduct, getSingleProduct } from "@/@api/dashboard/products.api";
import { LoadingIcon } from "@/interface/icons";
import { useEditProductDefaultDataStore } from "@/zustand/dashboard/productStore";
import { BACKEND_URL } from "../../../../../config";
import { revalidateServerAction } from "@/app/actions";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import Cookies from "universal-cookie";

export default function EditProduct() {

  const InitialProductData = {
    status: "Active",
    title: "",
    description: "",
    images: {
      image_one: "",
      image_two: "",
      image_three: "",
    },
    prev_images: {
      image_one: "",
      image_two: "", 
      image_three: ""
    },
    temporary_image_urls: {
      image_one: null,
      image_two: null,
      image_three: null,
    },
    selling_price: 0,
    original_price: 0,
    discount_based_pm: {
      allow: false,
      payment_method: "online",
      selling_price: 0,
    },
    quantity: "unlimited",
    limit_per_order: {
      minimum: 0,
      maximum: 0,
    },
    delivery_days: 3,
    delivery_charge: "free",
    variants: {
      variant_name: "",
      options: {
        option_one: "",
        option_two: "",
        option_three: "",
        option_four: "",
      },
      options_quantity: {
        option_one: 20,
        option_two: 20,
        option_three: 20,
        option_four: 20,
      }
    },
    accept_images: {
      allow: false,
      number: 1,
    },
    accept_message: {
      allow: false,
      label: "Any additional message?",
      required: false
    },
    seo: {
      allow: false,
      meta_title: "",
      meta_description: ""
    },
    categories: [],
    payment_methods: {
      cod: false,
      online: true,
    },
    slug: "",
  };

  const defaultEditProductData = useEditProductDefaultDataStore()
  const { update_edit_product_default_data } = useEditProductDefaultDataStore()
  const { update_unauthorized, username } = useUserStore()

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname();

  const [editProductData, setEditProductData] = useState<EditProductTypes>(InitialProductData);
  const [isFormErrors, setIsFormError] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({});
  const [errorType, setErrorType] = useState<"client" | "server">("client")
  const [loading, setLoading] = useState(false)
  const currentPage = searchParams.get("p") ?? "1"
  
  // set default data
  useEffect(() => {
    const getDefaultEditProductData = async () => {
      if(defaultEditProductData.fetch_status === true){
        let parts = pathname.split('/');
        let Id = parts[parts.length - 1];

        try {
        const res = await getSingleProduct(Id)
        
        if(defaultEditProductData.update_price){
          defaultEditProductData.update_price(res.data.selling_price, res.data.original_price)
        }

        if(defaultEditProductData.update_fetch_status) {
          defaultEditProductData.update_fetch_status(false);
        }
        
        setEditProductData((prevData) => ({
          ...prevData,
          ...res.data,
          temporary_image_urls: {
            image_one: res.data.images.image_one === "no_image" ? null : `${BACKEND_URL}/public/images/products/${res.data.images.image_one}`,
            image_two: res.data.images.image_two === "no_image" ? null : `${BACKEND_URL}/public/images/products/${res.data.images.image_two}`,
            image_three: res.data.images.image_three === "no_image" ? null : `${BACKEND_URL}/public/images/products/${res.data.images.image_three}`,
          },
          prev_images: {
            image_one: res.data.images.image_one,
            image_two: res.data.images.image_two,
            image_three: res.data.images.image_three
          }
        }))

        if(update_edit_product_default_data){
          update_edit_product_default_data(res.data)
        }
        } catch (error: any) {
          if (error.response.status === 401) {
            const cookies = new Cookies();
            cookies.remove("token", { path: "/" });
            update_unauthorized()
          }
        }
        
      }else{
        setEditProductData(defaultEditProductData)
      }
    }

    getDefaultEditProductData()
  }, [defaultEditProductData, pathname, update_edit_product_default_data, update_unauthorized])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (formErrors !== undefined) {
      const { [e.target.name]: _, ...rest } = formErrors;
      setFormErrors(rest);
    }

    setEditProductData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const additionalFormValidation = () => {
    if(editProductData.original_price > 99){
      return { original_price: "*You can only give maximum 99% original_price" }
    }
  }

  const handleCreateProduct = async () => {
    // form validation
    const exludedFields = [
      "accept_images",
      "categories",
      "delivery_charge",
      "description",
      "images",
      "limit_per_order",
      "payment_methods",
      "slug",
      "accept_message",
      "original_price",
      "status",
      "variants",
      "fetch_status",
      "discount_based_pm",
      "__v"
    ];

    const newFormErrors = formValidation(editProductData, exludedFields);
    const finalFormErrors = { ...newFormErrors}
    setFormErrors(finalFormErrors)
    const errorLength = Object.keys(finalFormErrors).length;
    if (errorLength > 0) {
      setErrorType("client")
      setIsFormError(true)
      return
    }
    setLoading(true)

    const formData = new FormData();
    for (const key in editProductData) {
      if (Object.prototype.hasOwnProperty.call(editProductData, key)) {
        const value = editProductData[key as keyof EditProductTypes];
        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    }
  
    // Append images separately
    formData.append('image_one', editProductData.images.image_one);
    formData.append('image_two', editProductData.images.image_two);
    formData.append('image_three', editProductData.images.image_three);

    // Append prev images 
    formData.append("prev_image_one", editProductData.prev_images.image_one)
    formData.append("prev_image_two", editProductData.prev_images.image_two)
    formData.append("prev_image_three", editProductData.prev_images.image_three)

    try {
      await editProduct(formData)
      revalidateServerAction("product")
      revalidateServerAction("category")
      toast.success("Product edited successfully")
      router.push(`/dashboard/products?p=${currentPage}`)
      setLoading(false)
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
      }
      toast.error("Product edit failed, try again")
      setErrorType("server")
      setIsFormError(true)
      setLoading(false)
    }
  };

  return (
    <>
      <ErrorPopup 
        server_title="Edit product"     
        client_title="product"
        type={errorType} 
        open={isFormErrors}
        onClose={()=> setIsFormError(false)}
        formErrors={formErrors}
      />
      <PageHeader title="Edit Product" className="border-b">
        <Div className="hidden mmd:flex gap-2">
          <Button onClick={handleCreateProduct} className="w-[9rem]" >
          {loading ? <LoadingIcon className="animate-spin" /> : "Update Product"}
          </Button>
        </Div>
      </PageHeader>
      <Div className="mt-4 lg:mt-3 flex flex-col lg:flex-row lg:items-start gap-[25px] pb-[5rem]">
        {/* skelton */}
        {defaultEditProductData.fetch_status === true && (
          <Div className="w-full h-[50vh] flex items-center flex-col justify-center" >
             <LoadingIcon className="animate-spin !w-[1.1rem] !h-[1.1rem]" />
             <Typography className="text-[12px] mt-[6px]" >loading...</Typography>
          </Div>
        )}
        {/* left side */}
        { defaultEditProductData.fetch_status === false && <Div className="w-full lg:w-[67%]">
          <EditTitleDescription
            editProductData={editProductData}
            formErrors={formErrors}
            setEditProductData={setEditProductData}
            handleInputChange={handleInputChange}
          />
          <EditPriceDetails
            editProductData={editProductData}
            setEditProductData={setEditProductData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
          {(username === "glories" || username === "appai") && (
            <EditPMPriceOffer
             editProductData={editProductData}
             setEditProductData={setEditProductData}
            />
          )}
          <EditImagesDetails
            setEditProductData={setEditProductData}
            editProductData={editProductData}
          />
          <EditDeliveryDetails
            formErrors={formErrors}
            handleInputChange={handleInputChange}
            editProductData={editProductData}
            setEditProductData={setEditProductData}
          />
          <EditVariantsDetails
            editProductData={editProductData}
            setEditProductData={setEditProductData}
          />
          <EditAdvancedOptions
            editProductData={editProductData}
            setEditProductData={setEditProductData}
          />
          <EditSeoDetails
           editProductData={editProductData}
           setEditProductData={setEditProductData}
          />
        </Div>}

        {/* right side */}
        {defaultEditProductData.fetch_status === false && (
          <Div className="w-full lg:w-[33%]">
          <EditStatusDetails 
            editProductData={editProductData}
            setEditProductData={setEditProductData}
          />
          <EditCategoriesDetails
            editProductData={editProductData}
            setEditProductData={setEditProductData}
          />
          <EditShareLinkDetails
            handleInputChange={handleInputChange}
            editProductData={editProductData}
          />
        </Div>
        )}
        
      </Div>

      <Div className="mmd:hidden flex items-center justify-center gap-2 w-full fixed left-0 bottom-0 h-[4.5rem] bg-white z-[50]">
        <Button disabled={loading} onClick={handleCreateProduct} className="w-[90%] h-[60%] cursor-not-allowed">
          {loading ? <LoadingIcon className="animate-spin" /> : "Edit Product"}
        </Button>
      </Div>
    </>
  );
}
