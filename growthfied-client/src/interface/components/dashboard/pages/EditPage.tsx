"use client"

import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Div, InputField, TextArea, Typography } from "@/interface/fragments";
import { AlertText, PageHeader } from "@/interface/components";
import { LoadingIcon } from "@/interface/icons";
import { formValidation } from "@/utils/formValidation";
import { toast } from "sonner";
import { useUserStore } from "@/zustand/dashboard/dashboardStore";
import { createPage, getSinglePage, updatePage } from "@/@api/dashboard/pages.api";
import {  EditPageTypes } from "@/types/dashboard/page";
import { useEditPageDefaultDataStore } from "@/zustand/dashboard/pageStore";
import Cookies from "universal-cookie";
import { revalidateServerAction } from "@/app/actions";


export default function EditPage() {

  const defaultEditPageData = useEditPageDefaultDataStore()
  const pathname = usePathname()
  const router = useRouter()
  const { update_unauthorized } = useUserStore()

  const InitialEditPageData = {
    page_title: "",
    page_content: ""
  }

  const [editPageData, seteditPageData] = useState<EditPageTypes>(InitialEditPageData)
  const [formErrors, setFormErrors] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<string>("empty")
  const [loading, setLoading] = useState(false)

  // set default data
  useEffect(() => {
    const getDefaultEditCoupenData = async () => {
      if(defaultEditPageData.fetch_status === true){
        let parts = pathname.split('/');
        let Id = parts[parts.length - 1];

        try {
          const res = await getSinglePage(Id)
        
        seteditPageData((prevData) => ({
          ...prevData,
          ...res.data,
        }))

        if(defaultEditPageData.update_edit_page_default_data){
            defaultEditPageData.update_edit_page_default_data(res.data)
        }

        if(defaultEditPageData.update_fetch_status) {
          defaultEditPageData.update_fetch_status(false);
        }
        } catch (error: any) {
          if (error.response.status === 401) {
            const cookies = new Cookies();
            cookies.remove("token", { path: "/" });
            update_unauthorized()
          }
        }
        
      }else{
        seteditPageData(defaultEditPageData)
      }
    }

    getDefaultEditCoupenData()
  }, [defaultEditPageData, pathname, update_unauthorized])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("empty")
    if (formErrors !== undefined) {
      const { [e.target.name]: _, ...rest } = formErrors;
      setFormErrors(rest);
    }

    seteditPageData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditPage = async () => {
    // form validation
    const newFormErrors = formValidation(editPageData,["fetch_status", "__v"])
    console.log(newFormErrors)
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return
    setLoading(true)

    try {
      if(editPageData._id) await updatePage(editPageData._id, editPageData)
      revalidateServerAction("store")
      toast.success("Page edited successfully")
      router.push("/dashboard/pages")
      setLoading(false)
    } catch (error: any) {
      if (error.response.status === 401) {
        const cookies = new Cookies();
        cookies.remove("token", { path: "/" });
        update_unauthorized()
        return
      }
      if (error.response.status === 409) {
        setErrorMessage("This page is already exist!, please choose another title")
        setLoading(false)
        return
      }
        setErrorMessage("Something Went Wrong!")
        setLoading(false)
        toast.error("Page edit failed, try again")

    }
  }

  return (
    <>

    <PageHeader title="Edit Page" className="sticky bg-[#f1f1f1] border-b border-[#eae8e8] py-[10px] top-[67px] z-[49]">
      <Div className="hidden mmd:flex gap-2">
        <Button onClick={handleEditPage} className="!w-[8rem]" >
         {loading ? <LoadingIcon className="animate-spin" /> : "Edit Page"}
        </Button>
      </Div>
    </PageHeader>
    { errorMessage !== "empty" && (<AlertText
         text={errorMessage}
         variant="danger"
         className="mt-1"
        />)}

         {defaultEditPageData.fetch_status === true && (
          <Div className="w-full h-[50vh] flex items-center flex-col justify-center" >
             <LoadingIcon className="animate-spin !w-[1.1rem] !h-[1.1rem]" />
             <Typography className="text-[12px] mt-[6px]" >loading...</Typography>
          </Div>
        )}

      { defaultEditPageData.fetch_status === false && (<Div className="mt-4 lg:mt-3 flex flex-col lg:flex-row lg:items-start gap-[25px] pb-[5rem]" >
        <Div className="w-full" >
          <Div className="w-full bg-white rounded-[4px] px-[12px] pb-[2rem] pt-[3px]" >
           <InputField
            type="text"
            label="Page Title"
            name="page_title"
            placeHolder="Eg: Return Policy"
            containerStyle="mt-3"
            inputContainerStyle="mt-[5px]"
            className="w-full bg-gray-100 mt-[2px]"
            onChange={handleInputChange}
            invalid={!!formErrors?.page_title}
            errorMessage={formErrors?.page_title}
            defaultValue={defaultEditPageData.page_title}
           />
  
           <Div className="mt-[10px]" >
             <TextArea
              label="Page Content"
              name="page_content"
              className="bg-gray-100 w-full !h-[calc(100vh-20rem)] !resize-y overflow-y-scroll"
              inputContainerStyle="mt-[5px]"
              placeHolder="Enter Your Page Content"
              onChange={handleInputChange}
              invalid={!!formErrors?.page_content}
              errorMessage={formErrors?.page_content}
              defaultValue={defaultEditPageData.page_content}
             />
           </Div>

          </Div>
        </Div>
      </Div>)}

      <Div className="mmd:hidden flex items-center justify-center gap-2 w-full fixed left-0 bottom-0 h-[4.5rem] bg-white z-[50]">
        <Button onClick={handleEditPage} className="w-[90%] h-[60%] cursor-not-allowed">
         {loading ? <LoadingIcon className="animate-spin" /> : "Edit Page"}
        </Button>
      </Div>
    </>
  );
}
