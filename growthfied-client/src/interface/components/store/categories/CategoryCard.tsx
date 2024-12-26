import Image from "next/image";
import Link from "next/link";
import { Div, Typography } from "@/interface/fragments";
import { BACKEND_URL } from "../../../../../config";
import DemoImage from '../../../../../public/settings/category.png'

type CategoryProps = {
  category: any
  storename: string
}

export default function Categories({ storename, category }: CategoryProps) {
  return (
    <Link href={`/categories/${encodeURI(category?._id)}`} className="w-[44%] mmd:w-[30%] lg:w-[30%] xl:[20%] 2xl:w-[18%] bg-white border border-transparent hover:border-[#3333339b]  cursor-pointer rounded-[7px] p-0 rounded-8 md:rounded-10">
      { category.image !== "no_image" ? (<Image
        width={320}
        height={400}
        alt="category_image"
        className="text-10 transition-all h-[12rem] object-cover object-center w-full shadow rounded-[7px] rounded-b-none"
        loading="lazy"
        src={`${BACKEND_URL}/public/images/categories/${category.image}`}
      />) : (<Image
        width={320}
        height={400}
        alt="category_image"
        className="text-10 transition-all h-[12rem] object-cover object-center w-full shadow rounded-[7px] rounded-b-none"
        loading="lazy"
        src={DemoImage}
      />) }
      <Div className="h-[3rem] md:h-[2.3rem] w-full flex flex-col gap-[3px] px-2 justify-center shadow-xl rounded-[7px] rounded-t-none mt-[3px]" >
        <Typography className="text-[14px] text-center" >{category?.category_name}</Typography>
      </Div>
    </Link>
  )
}
