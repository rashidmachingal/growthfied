import { Button, Div, Typography } from "@/interface/fragments";
import SingleLogo from "../../../../public/brand/single-logo.png";
import Image from "next/image";

type NotFoundProps = {
  type: "store" | "product" | "deactivated";
};

export default function NotFound({ type }: NotFoundProps) {
  const notFoundComponents = {
    store: <Store />,
    deactivated: <Deactivated />,
    product: <Product />,
  };

  return notFoundComponents[type];
}

// not found components
const Store = () => {
  return (
    <Div className="h-screen flex flex-col items-center">
      <Image
        src={SingleLogo}
        width={0}
        height={0}
        alt="logo"
        className="w-[3rem] h-[3rem] rounded-[50px] mt-[10rem]"
      />
      <Typography className="mt-[2rem] font-medium" variant="h2">
        Not Found 404
      </Typography>
      <Typography>
        Sorry, we can&apos;t find the store/profile you are looking for
      </Typography>
      <Div className="flex items-center gap-3">
        <Button type="link" url="https://www.growthfied.com" className="mt-[2rem]">
          Create your own online store
        </Button>
      </Div>
    </Div>
  );
};

const Deactivated = () => {
  return <></>;
};

const Product = () => {
  return (
    <Div className="flex flex-col items-center">
      <Image
        src={SingleLogo}
        width={0}
        height={0}
        alt="logo"
        className="w-[3rem] h-[3rem] rounded-[50px] mt-[10rem]"
      />
      <Typography className="mt-[2rem] font-medium" variant="h2">
        Not Found 404
      </Typography>
      <Typography>
        Sorry, we can&apos;t find the product you are looking for
      </Typography>
    </Div>
  );
};
