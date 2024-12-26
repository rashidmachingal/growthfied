// react
import { ReactNode } from 'react'

// fragments
import { Div } from '@/interface/fragments'

type BoxProps = {
    className?: string
    children?: ReactNode
}

export default function Box({ className, children }: BoxProps) {
  return (
    <Div className={`w-full bg-white rounded-[3px] shadow-sm ${className}`} >
        {children}
    </Div>
  )
}
