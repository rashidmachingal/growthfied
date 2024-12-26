import { ChangeEventHandler } from "react"

type RadioButtonProps = {
    className?: string
    name?: string
    id?: string
    checked?: boolean
    onChange?: ChangeEventHandler<HTMLInputElement>
}
export default function RadioButton({ className, name, id, checked, onChange }: RadioButtonProps) {
  return (
    <>
    <input onChange={onChange} className={`w-[17px] h-[17px] accent-black ${className}`} type="radio" id={id} name={name} checked={checked} />
    </>
  )
}
