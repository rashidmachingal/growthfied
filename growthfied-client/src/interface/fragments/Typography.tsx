// react
import { ReactNode } from "react"

type TypographyProps = {
    children: ReactNode
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"
    className?: string
}

export default function Typography({ children, variant = "p", className }: TypographyProps) {
    switch (variant) {
        case 'h1':
            return <h1 className={`text-[36px] ${className}`}>{children}</h1>
        case 'h2':
            return <h2 className={`text-[30px] ${className}`}>{children}</h2>
        case 'h3':
            return <h3 className={`text-[24px] ${className}`}>{children}</h3>
        case 'h4':
            return <h4 className={`text-[18px] ${className}`}>{children}</h4>
        case 'h5':
            return <h5 className={`text-[16px] ${className}`}>{children}</h5>
        case 'h6':
            return <h6 className={`text-[14px] ${className}`}>{children}</h6>
        case 'p':
            return <p className={`${className}`}>{children}</p>
        default:
            return <p className={`${className}`}>{children}</p>
    }
}