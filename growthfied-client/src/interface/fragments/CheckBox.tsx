// react
import { ChangeEventHandler } from "react"

type InputFieldProps = {
  onChange?: ChangeEventHandler<HTMLInputElement>
  checked?: boolean
  className?: string
}

export default function CheckBox({ onChange, checked,  className }: InputFieldProps) {
  return (
       <input
         type="checkbox"
         onChange={onChange}
         checked={checked}
         className={`glowing-border ${className} accent-black`}
        />
  )
}
