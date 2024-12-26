import { Div } from "@/interface/fragments";

type AvatarProps = {
  className?: string
  letter: string
}

export default function Avatar({ className, letter }: AvatarProps) {
  return (
    <Div className={`uppercase w-[1.8rem] h-[1.8rem] bg-[#0c8ce9] rounded-theme flex items-center justify-center text-white text-sm ${className}`}>
      {letter}
    </Div>
  );
}
