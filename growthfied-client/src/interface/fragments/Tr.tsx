// react
import { ReactNode } from "react"

type TrProps = {
    className?: string
    children: ReactNode
}

export default function Tr({ className, children}: TrProps) {
  return (
    <tr className={className} >
        {children}
    </tr>
  )
}
