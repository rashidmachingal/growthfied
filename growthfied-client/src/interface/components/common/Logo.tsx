import Image from "next/image";
import LogoBlack from "../../../../public/brand/logo.png";
import LogoWhite from "../../../../public/brand/logo-white.png";

type LogoProps = {
  className?: string;
  color: "black" | "white"
};

export default function Logo({ className, color }: LogoProps) {
  return (
    <Image
      src={color === "black" ? LogoBlack : LogoWhite}
      width={200}
      height={100}
      alt="Growthfied Logo"
      className={className}
    />
  );
}
