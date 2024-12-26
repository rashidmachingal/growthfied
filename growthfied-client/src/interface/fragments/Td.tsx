// react
import { ReactNode } from "react"

type TdProps = {
    className?: string
    children: ReactNode
}

export default function Td({ className, children}: TdProps) {
  return (
    <tbody className={className} >
        {children}
    </tbody>
  )
}
