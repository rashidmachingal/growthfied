import { ChangeEventHandler } from "react";
import { Div, Typography } from "@/interface/fragments";


type OptionType = {
    value: any;
    label: string;
  };

type VanilaSelectProps = {
    disabled?: boolean
    label?: string | boolean
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    value?: string
    defaultValue?: any
    containerStyle?: string
    className?: string
    id?: string
    options: OptionType[];
  }

export default function VanilaSelect({ containerStyle, label = false, className, id, options, defaultValue, onChange, value }: VanilaSelectProps) {
  return (
    <Div className={containerStyle} >
       <Typography className="text-[13px] ml-1" >{label}</Typography>
       <select onChange={onChange} value={value} defaultValue={defaultValue} id={id} className={`px-3 w-full h-theme rounded-[4px] outline-none glowing-border border ${className}`} >
            {options.map((data) => (
              <option key={data.value} value={data.value} >{data.label}</option>
            ))}
       </select>
    </Div>
  )
}
