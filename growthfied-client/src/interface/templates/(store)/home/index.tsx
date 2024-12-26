import Image from "next/image";
import { Button, Div, Typography } from "@/interface/fragments";
import NoDataImage from '../../../../../public/settings/no-data.png';
import { Pagination, ProductCard, StoreBottomNavbar, StoreFooter, StoreHomeTopbar } from "@/interface/components";

type StoreHomeTemplateProps = {
  store?: {
    status: "not-found" | "deactivated" | "active"
    store_name: string
    profile_picture: string
    bio: string
  }
  products: any[]
  storename: string
  bio: string
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function StoreHomeTemplate({ products, storename, searchParams, bio, }: StoreHomeTemplateProps) {

  // pagination
  const page = searchParams['page'] ?? '1'
  const start = (Number(page) - 1) * 12
  const end = start + 12
  const entries = products?.slice(start, end)

  return (
    <>
    <Div className="w-full border-b-2 bg-img h-[17rem] md:h-[20rem] flex flex-col gap-5 items-center justify-center mt-[-10px]" >
      <Typography variant="h3" className="text-center !text-[18px] md:!text-[20px]" >{bio}</Typography>
      <Div>
        <Button type="link" url="/#products" className="!h-[2.2rem]" >SHOP NOW</Button>
      </Div>
    </Div>
    <Div className="mt-3" id="products" >
      <Typography variant="h4" className="!text-[18px] md:!text-[21px]" >Products</Typography>
    </Div>
    <Div className="w-full md:w-[95%] lg:w-[80%] flex justify-center gap-[1rem] md:gap-[2rem] flex-wrap mt-[1.5rem] md:mt-[2.5rem]" >
      {entries.map((data: any) => (
        <ProductCard key={data._id} storename={storename} data={data} />
      ))}
      {products?.length === 0 && (
        <Div className="flex flex-col items-center justify-center w-full h-[40vh]" >
          <Image src={NoDataImage} width={180} height={180} alt="image" className="w-[8rem] h-[8rem]" />
          <Typography className="text-[18px] font-medium text-center mt-3" >No Products</Typography>
          <Typography className="text-center text-[13px]" >Currently, there are no products available at @{storename}. Please check back later!</Typography>
        </Div>
      )}
     </Div>
      <Div className="mt-5" >
       <Pagination  
        hasPrevPage={start > 0}
        hasNextPage={end < products.length}
        totalLength={products.length}
        url="?"
       />
      </Div>
    </>
  )
}