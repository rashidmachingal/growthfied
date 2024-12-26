import { PageHeader, SettingsSidebar, UpdateFooter } from "@/interface/components";
import { Div, Section } from "@/interface/fragments";

export default function FooterTemplate() {
  return (
    <>
    <PageHeader
            title="Change Password"
            className="sticky bg-[#f1f1f1] border-b border-[#eae8e8] py-[10px] top-[67px] z-[49]"
          />
    
          <Section className="flex gap-5" >
          <Div className="hidden md:block w-[16rem]" >
          <SettingsSidebar active="footer" />
          </Div>
    
          <Div className="flex items-start gap-4 flex-col w-full mt-3">
            <UpdateFooter/>
          </Div>
          </Section>

    </>
  )
}
