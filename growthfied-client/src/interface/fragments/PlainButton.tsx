// react
import { MouseEventHandler, ReactNode } from "react"

type PlainButtonProps = {
    className?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
    children?: ReactNode
    disabled?: boolean
}

export default function PlainButton({ className, onClick, children, disabled }: PlainButtonProps) {
  return (
    <button className={className} onClick={onClick} disabled={disabled} >{children}</button>
  )
}
