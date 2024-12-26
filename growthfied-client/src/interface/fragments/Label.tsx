// react
import { ReactNode } from "react"

type LabelProps = {
    htmlFor?: string
    className?: string
    children: ReactNode
}

export default function Label( { htmlFor, className, children } : LabelProps ) {
  return (
    <label htmlFor={htmlFor}  className={className} >{children}</label>
  )
}
