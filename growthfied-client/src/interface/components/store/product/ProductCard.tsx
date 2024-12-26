import Link from "next/link";
import Image from "next/image";
import { Div, Typography } from "@/interface/fragments";
import { CreateProductTypes } from "@/types/dashboard/products";
import { calculateDiscountedPrice, getProductDiscountPercentage, getProductThumbnail } from "@/utils";

type ProductTypes = CreateProductTypes & {
  _id: string
};

type ProductCardProps = {
  data: ProductTypes
  storename: string
};

export default function ProductCard({ data }: ProductCardProps) {

  return (
    <Link href={`/product/${data?.slug}`} className="w-[44%] mmd:w-[30%] lg:w-[30%] xl:[20%] 2xl:w-[20%] bg-white border border-transparent hover:border-[#3333339b] cursor-pointer rounded-theme p-0 rounded-8 md:rounded-10">
      <Image
        width={400}
        height={400}
        className="text-10 transition-all h-[15rem] object-cover object-center w-full rounded-theme rounded-b-none"
        loading="lazy"
        src={getProductThumbnail(data)}
        alt="image"
      />
      <Div className="h-[5rem] md:h-[4rem] w-full flex flex-col shadow gap-[3px] px-2 justify-center rounded-theme rounded-t-none mt-[3px]" >
        <Typography className="text-[11px] md:text-[12px]" >
          {data?.title && data?.title.length > 65 ? `${data?.title.slice(0, 60)}...` : data.title}
        </Typography>
        <Div className="flex items-center gap-[5px]" >
          <Typography className="text-[15px] font-medium" >
           ₹{data?.selling_price}
          </Typography>

          { data.original_price > data.selling_price && (
            <Typography className="text-[12px] line-through text-gray-400" >
            ₹{data?.original_price}
            </Typography>
          )}

          { data.original_price > data.selling_price && Math.trunc(getProductDiscountPercentage(data.selling_price, data.original_price)) !== 0 && (
            <Typography className="text-[12px] text-green-500" >
              {Math.trunc(getProductDiscountPercentage(data?.selling_price, data?.original_price))}% OFF
           </Typography>
          )}
        </Div>
      </Div>
    </Link>
  );
}
