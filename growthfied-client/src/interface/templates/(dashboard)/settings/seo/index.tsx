"use client"

import { Div, Section } from "@/interface/fragments";
import { PageHeader, SettingsSidebar, UpdateSeoInfo } from "@/interface/components";

export default function StoreSeoTemplate() {
  return (
    <>
      <PageHeader
        title="Seo"
        className="sticky bg-[#f1f1f1] border-b border-[#eae8e8] py-[10px] top-[67px] z-[49]"
      />

      <Section className="flex gap-5" >
      <Div className="hidden md:block w-[16rem]" >
      <SettingsSidebar active="seo" />
      </Div>

      <Div className="flex items-start gap-4 flex-col w-full mt-3">
          <UpdateSeoInfo/>
      </Div>
      </Section>
    </>
  );
}
