import { Div, Typography } from "@/interface/fragments";
import { AddToCart, ProductCartManagement } from "@/interface/components";
import { CreateProductTypes } from "@/types/dashboard/products";
import { calculateDiscountedPrice, getProductDiscountPercentage } from "@/utils";

type ProductDetailsProps = {
    product: CreateProductTypes
}

export default function ProductDetails({ product }: ProductDetailsProps) {

  return (
    <Div className="w-full lg:w-[60%] mt-2 px-[1.7rem] lg:px-0" >
        <Typography className="!text-[16px] md:!text-[20px] font-medium" variant="h1" >{product?.title}</Typography>
        <Div className="flex items-center gap-[5px]" >
         <Typography className="text-[18px]" >
            ₹{product?.selling_price}
        </Typography>
        
         {product.original_price > product.selling_price && (
          <Typography className="text-[14px] line-through text-gray-400" >
            ₹{product?.original_price}
         </Typography>)}

         { product.original_price > product.selling_price && Math.trunc(getProductDiscountPercentage(product.selling_price, product.original_price)) !== 0 &&
          (
           <Typography className="text-[14px] text-green-600" >
            {Math.trunc(getProductDiscountPercentage(product?.selling_price, product?.original_price))}% OFF
           </Typography>
          )
         }
        </Div>
        
        <ProductCartManagement product={product} />

        <Typography className="mt-[22px] text-[14px] whitespace-pre-wrap"  >
            {product?.description}
        </Typography>
    </Div>
  )
}
