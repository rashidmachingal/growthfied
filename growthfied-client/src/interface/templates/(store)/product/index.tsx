import { Div, Section } from "@/interface/fragments";
import { ProductDetails, ProductImages } from "@/interface/components";
import { CreateProductTypes } from "@/types/dashboard/products";

type StoreProductTemplateProps = {
  product: CreateProductTypes
}

export default function StoreProductTemplate({ product}: StoreProductTemplateProps) {


  return (
    <>
    <Section className="w-full mt-[5.3rem] md:mt-[6.2rem] flex flex-col md:flex-row gap-[1.25rem] md:gap-[8rem]" >
        <Div className="w-full md:w-[50%] flex justify-end" >
         <ProductImages images={product.images} />
        </Div>
        <Div className="w-full lg:w-[50%] flex justify-start" >
            <ProductDetails product={product} />
        </Div>
    </Section>
{/*     <Section className="w-full md:w-[50%] pb-[10rem] flex flex-col items-center md:items-end md:pr-[4rem] mt-[5rem]" >
      <AddReview/>
      <Div className="mt-3 w-full md:w-auto items-center flex flex-col gap-5" >
        <Div className="w-full px-[20px] md:px-0 " >
        <Typography>Reviews</Typography>
        </Div>
        <ReviewCard/>
        <ReviewCard/>
        <ReviewCard/>
      </Div>
    </Section> */}
    </>
  )
}
