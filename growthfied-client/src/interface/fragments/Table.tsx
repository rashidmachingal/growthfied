// react
import { ReactNode } from "react"

type TableProps = {
    className?: string
    children: ReactNode
}

export default function Table({ className, children}: TableProps) {
  return (
    <table className={className} >
        {children}
    </table>
  )
}
