// react
import { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string
};

export default function Section({ children, className, id }: SectionProps) {
  return <section className={className} id={id} >{children}</section>;
}
