"use client"

import { Div, Section } from "@/interface/fragments";
import { PageHeader, SettingsSidebar, UpdatePaymentMethod } from "@/interface/components";

export default function PaymentMethodTemplate() {
  return (
    <>
      <PageHeader
        title="Payment Method"
        className="sticky bg-[#f1f1f1] border-b border-[#eae8e8] py-[10px] top-[67px] z-[49]"
      />

      <Section className="flex gap-5" >
      <Div className="hidden md:block w-[16rem]" >
      <SettingsSidebar active="payment_method" />
      </Div>

      <Div className="flex items-start gap-4 flex-col w-full mt-3">
          <UpdatePaymentMethod/>
      </Div>
      </Section>
    </>
  );
}
