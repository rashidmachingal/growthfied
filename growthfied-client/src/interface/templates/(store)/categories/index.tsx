import Image from "next/image";
import { Div, Section, Typography } from "@/interface/fragments";
import { CategoryCard } from "@/interface/components";
import { CategoryDataTypes } from "@/types/dashboard/categories";
import NoDataImage from '../../../../../public/settings/no-data.png';

type StoreCategoriesTemplateProps = {
  storename: string
  categories: CategoryDataTypes & { _id: string }[]
}

export default function StoreCategoriesTemplate({ storename, categories }: StoreCategoriesTemplateProps) {
  return (
    <Section className="w-full flex flex-col items-center mt-[5.5rem]" >
        <Typography className="mt-2" >Shop by Categories</Typography>
        <Div className="w-full md:w-[95%] lg:w-[60%] flex justify-center gap-[1rem] md:gap-[2rem] flex-wrap mt-5" >
            {categories?.map((data)=> (
              <CategoryCard storename={storename} category={data} key={data._id} />
            ))}
        </Div>
        {categories.length === 0 && (
          <Div className="flex flex-col items-center justify-center w-full h-[40vh]" >
          <Image src={NoDataImage} width={150} height={150} alt="image" className="w-[8rem] h-[8rem]" />
          <Typography className="text-[18px] font-medium text-center mt-3" >Currently, there are no categories</Typography>
          <Typography className="text-[18px] font-medium text-center" >@{storename}</Typography>
        </Div>
        )}
    </Section>
  )
}
