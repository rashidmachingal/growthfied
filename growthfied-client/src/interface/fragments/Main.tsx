// react
import { ReactNode } from "react";

type MainProps = {
  children: ReactNode;
  className?: string;
};

export default function Main({ children, className }: MainProps) {
  return <main className={className}>{children}</main>;
}
