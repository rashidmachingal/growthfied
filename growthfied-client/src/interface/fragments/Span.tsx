// react
import { ReactNode } from "react";

type SpanProps = {
  children?: ReactNode;
  className?: string;
};

export default function Span({ children, className }: SpanProps) {
  return <span className={className}>{children}</span>;
}
