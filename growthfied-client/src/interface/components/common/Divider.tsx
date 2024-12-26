// react
import { ReactNode } from "react";

// fragments
import { Div, Span } from "@/interface/fragments";

type DividerProps = {
    className?: string
    children: ReactNode
}

export default function Divider({ className, children }: DividerProps) {
  return (
    <Div className={`w-full flex items-center gap-3 text-[12px] ${className}`} >
        <Span className="w-[50%] h-[2px] bg-gray-100" />
        {children}
        <Span className="w-[50%] h-[1px] bg-gray-100" />
    </Div>
  )
}
