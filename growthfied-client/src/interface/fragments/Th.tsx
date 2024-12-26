// react
import { ReactNode } from "react"

type ThProps = {
    className?: string
    children: ReactNode
}

export default function Th({ className, children}: ThProps) {
  return (
    <th className={className} >
        {children}
    </th>
  )
}
