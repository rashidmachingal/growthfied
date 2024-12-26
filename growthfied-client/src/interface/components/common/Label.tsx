// fragments
import { Div, Typography } from "@/interface/fragments";

type LabelProps = {
  title?: string;
  className?: string;
};

export default function Label({ className, title }: LabelProps) {
  return (
    <Div className={`${className} min-w-[4rem] py-[1px] rounded-full flex items-center justify-center text-[10px]`}>
      <Typography className="mt-[1px]" >{title}</Typography>
    </Div>
  );
}
