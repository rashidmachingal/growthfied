"use client"

import { Div, Section } from "@/interface/fragments";
import { PageHeader, SettingsSidebar, UpdateUsername } from "@/interface/components";

export default function SettingsTemplate() {

  return (
    <>
      <Div className="md:hidden" >
      <PageHeader
        title="Settings"
        className="sticky bg-[#f1f1f1] border-b border-[#eae8e8] py-[10px] top-[67px] z-[49]"
      />
      </Div>

      <Div className="w-full md:hidden" >
       <SettingsSidebar active="" />
      </Div>

      <Div className="hidden md:block" >
      <PageHeader
        title="Store Name"
        className="sticky bg-[#f1f1f1] border-b border-[#eae8e8] py-[10px] top-[67px] z-[49]"
      />
      </Div>

      <Section className="gap-5 hidden md:flex" >
      <Div className="hidden md:block w-[16rem]" >
       <SettingsSidebar active="user_name" />
      </Div>

      <Div className="flex items-start gap-4 flex-col w-full mt-3">
          <UpdateUsername/>
      </Div>
      </Section>
    </>
  );
}
