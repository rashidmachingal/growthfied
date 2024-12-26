"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Button, Div } from "@/interface/fragments";
import {
  PageHeader,
  TitleDescription,
  PriceDetails,
  ImagesDetails,
  DeliveryDetails,
  VariantsDetails,
  AdvancedOptions,
  StatusDetails,
  CategoriesDetails,
  PaymentMethods,
  ShareLinkDetails,
  ErrorPopup,
  SeoDetails,
  PMPriceOffer,
} from "@/interface/components";
import { CreateProductTypes } from "@/types/dashboard/products";
import { formValidation } from "@/utils/formValidation";
import { toast } from "sonner";
import { createProduct } from "@/@api/dashboard/products.api";
import { LoadingIcon } from "@/interface/icons";
import { revalidateServerAction } from "@/app/actions";
import Cookies from "universal-cookie";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";

export default function CreateProduct() {

  const InitialProductData = {
    status: "Active",
    title: "",
    description: "",
    images: {
      image_one: "",
      image_two: "",
      image_three: "",
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
      minimum: 1,
      maximum: 20,
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
    slug: ""
  };

  const router = useRouter()
  const { update_unauthorized, username } = useUserStore()

  const [productData, setProductData] = useState<CreateProductTypes>(InitialProductData);
  const [isFormErrors, setIsFormError] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({});
  const [errorType, setErrorType] = useState<"client" | "server">("client")
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (formErrors !== undefined) {
      const { [e.target.name]: _, ...rest } = formErrors;
      setFormErrors(rest);
    }

    setProductData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const additionalFormValidation = () => {
    if(productData.original_price > 99){
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
      "discount_based_pm"
    ];

    const newFormErrors = formValidation(productData, exludedFields);
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
    for (const key in productData) {
      if (Object.prototype.hasOwnProperty.call(productData, key)) {
        const value = productData[key as keyof CreateProductTypes];
        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    }
  
    // Append images separately
    formData.append('image_one', productData.images.image_one);
    formData.append('image_two', productData.images.image_two);
    formData.append('image_three', productData.images.image_three);

    try {
      await createProduct(formData)
      revalidateServerAction("product")
      revalidateServerAction("category")
      toast.success("Product created successfully")
      router.push("/dashboard/products")
      setLoading(false)
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
      }
      toast.error("Product creation failed, try again")
      setErrorType("server")
      setIsFormError(true)
      setLoading(false)
    }
  };

  return (
    <>
      <ErrorPopup 
        server_title="Creating product"
        client_title="product"
        type={errorType} 
        open={isFormErrors}
        onClose={()=> setIsFormError(false)}
        formErrors={formErrors}
      />
      <PageHeader title="Add Product" className="border-b">
        <Div className="hidden mmd:flex gap-2">
          <Button onClick={handleCreateProduct} className="w-[9rem]" >
          { loading ? <LoadingIcon className="animate-spin" /> : "Add Product" }
          </Button>
        </Div>
      </PageHeader>
      <Div className="mt-4 lg:mt-3 flex flex-col lg:flex-row lg:items-start gap-[25px] pb-[5rem]">
        {/* left side */}
        <Div className="w-full lg:w-[67%]">
          <TitleDescription
            formErrors={formErrors}
            productData={productData}
            setProductData={setProductData}
            handleInputChange={handleInputChange}
          />
          <PriceDetails
            productData={productData}
            setProductData={setProductData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
          {(username === "glories" || username === "appai") && (
            <PMPriceOffer
             productData={productData}
             setProductData={setProductData}
            />
          )}
          <ImagesDetails
            setProductData={setProductData}
            productData={productData}
          />
          <DeliveryDetails
            formErrors={formErrors}
            handleInputChange={handleInputChange}
            productData={productData}
            setProductData={setProductData}
          />
          <VariantsDetails
            productData={productData}
            setProductData={setProductData}
          />
          <AdvancedOptions
            productData={productData}
            setProductData={setProductData}
          />
          <SeoDetails 
            productData={productData}
            setProductData={setProductData}
          />
        </Div>

        {/* right side */}
        <Div className="w-full lg:w-[33%]">
          <StatusDetails setProductData={setProductData} />
          <CategoriesDetails
            productData={productData}
            setProductData={setProductData}
          />
          <ShareLinkDetails
            handleInputChange={handleInputChange}
            productData={productData}
          />
        </Div>
      </Div>

      <Div className="mmd:hidden flex items-center justify-center gap-2 w-full fixed left-0 bottom-0 h-[4.5rem] bg-white z-[50]">
        <Button disabled={loading} onClick={handleCreateProduct} className="w-[90%] h-[60%] cursor-not-allowed">
          {loading ? <LoadingIcon className="animate-spin" /> : "Create Product"}
        </Button>
      </Div>
    </>
  );
}
