// react
import { MouseEventHandler, ReactNode } from "react";

type DivProps = {
  style?: any
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>
  id?: string
};

export default function Div({ style, children, className, onClick, id }: DivProps) {
  return <div style={style} className={className} onClick={onClick} id={id} >{children}</div>;
}
