// react
import { ReactNode } from "react"

type TheadProps = {
    className?: string
    children: ReactNode
}

export default function Thead({ className, children}: TheadProps) {
  return (
    <thead className={className} >
        {children}
    </thead>
  )
}
