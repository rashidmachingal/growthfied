import Image from "next/image";
import { Div, Section, Typography } from "@/interface/fragments";
import { Pagination, ProductCard } from "@/interface/components";
import NoDataImage from '../../../../../../public/settings/no-data.png';

type CategoryViewTemplateProps = {
  storename: string
  category_id: string
  category_name: string
  products: any
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CategoryViewTemplate({ storename, category_id, category_name, products, searchParams }: CategoryViewTemplateProps) {

    // pagination
    const page = searchParams['page'] ?? '1'
    const start = (Number(page) - 1) * 12
    const end = start + 12
    const entries = products.slice(start, end)

  return (
    <Section className="flex flex-col items-center md:mt-[5rem] pb-[8rem] md:pb-[5rem] w-full mt-[5.5rem]" >
      <Div className="mt-[1rem] shadow w-[90%] md:w-[70%] h-[2.3rem] px-4 flex items-center rounded-[3px]" >
        <Typography>Category: {category_name}</Typography>
      </Div>
    <Div className="w-full md:w-[95%] lg:w-[80%] flex justify-center gap-[1rem] md:gap-[2rem] flex-wrap mt-[2rem]" >
    {entries?.map((data: any) => (
        <ProductCard key={data._id} data={data} storename={storename} />
      ))}
    </Div>
      {products.length === 0 && (
        <Div className="flex flex-col items-center justify-center w-full h-[40vh]" >
          <Image src={NoDataImage} width={180} height={180} alt="image" className="w-[8rem] h-[8rem]" />
          <Typography className="text-[18px] font-medium text-center mt-3" >No Products On {decodeURIComponent(category_name)}</Typography>
          <Typography className="text-center text-[13px]" >Currently, there are no products available at {decodeURIComponent(category_name)}. Please check back later!</Typography>
        </Div>
      )}
     <Div className="mt-5" >
     <Pagination 
       url={`/categories/${category_id}?`} 
       hasPrevPage={start > 0}
       hasNextPage={end < products.length}
       totalLength={products.length}
      />
     </Div>
    </Section>
  )
}
