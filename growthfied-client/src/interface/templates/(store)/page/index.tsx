import { Section, Typography } from "@/interface/fragments";

type PageTemplateProps = {
  page_data: any
}

export default function PageTemplate({ page_data } : PageTemplateProps) {
  return (
    <Section className="mt-[5.5rem] px-[1.8rem] md:px-[8rem] xl:px-[15rem] ">
      <Typography variant="h1" className="!text-[25px] font-semibold" >{page_data?.page_title}</Typography>
      <Typography className="whitespace-pre-wrap" >
        {page_data?.page_content}
      </Typography>
    </Section>
  );
}
