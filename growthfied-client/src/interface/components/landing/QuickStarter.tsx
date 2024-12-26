"use client";

import { ChangeEvent, useState } from "react";
import { Button, Div, Form, InputField, Span } from "@/interface/fragments";
import { formValidation } from "@/utils/formValidation";
import { checkUsername } from "@/@api/auth/auth.api";
import { LoadingIcon } from "@/interface/icons";
import { useRouter } from "next/navigation";
import { DOMAIN_NAME } from "../../../../config";

export default function QuickStarter() {

  const router = useRouter()

  const [userNameData, setUserNameData] = useState({ username: "" })
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<any>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormErrors({})
    setUserNameData({ username: e.target.value.toLowerCase() })
  }

  const handleCheckUsername = async (e: any) => {
    e.preventDefault()

    // username validation
    const newFormErrors = formValidation(userNameData)
    setFormErrors(newFormErrors)
    const errorLength = Object.keys(newFormErrors).length;
    if(errorLength > 0) return
    setLoading(true)

    router.push(`/create-store?n=${userNameData.username}`)
  }

  return (
    <Form onSubmit={handleCheckUsername} className="flex flex-col gap-3 mt-8 w-[85%] xm:w-auto">
      <Div className="w-full" >
      <InputField
        type="text"
        name="username"
        label="Choose a subdomain for your store"
        placeHolder="subdomain"
        innerText={`.${DOMAIN_NAME}`}
        innerTextStyle={`right-[11px] text-[15px] top-[7px] z-[50]`}
        containerStyle="mt-2"
        inputContainerStyle="mt-[2px]"
        className="w-full lowercase bg-gray-100 pr-[9.5rem]"
        onChange={handleChange}
        invalid={!!formErrors?.username}
        errorMessage={`Please enter subdomain*`}

      />
      </Div>
      <Div className="flex flex-col gap-1">
        <Button disabled={loading} onClick={handleCheckUsername} >
          {loading ? <LoadingIcon className="animate-spin" /> : "Start for free"}
        </Button>
        <Span className="text-[10px] ml-2">free-trial*</Span>
      </Div>
    </Form>
  );
}
