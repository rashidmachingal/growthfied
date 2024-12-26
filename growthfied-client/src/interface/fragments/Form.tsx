import { FormEventHandler, ReactNode } from "react"

type FormProps = {
  children: ReactNode
  onSubmit?: FormEventHandler<HTMLFormElement>
  className?: string
}

export default function Form({ children, onSubmit, className }: FormProps) {
  return (
    <form className={className} onSubmit={onSubmit}  >
      {children}
    </form>
  )
}
