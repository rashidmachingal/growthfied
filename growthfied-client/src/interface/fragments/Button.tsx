// next
import Link from "next/link";

// react
import { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  children?: ReactNode;
  type?: "button" | "link";
  url?: any;
  className?: string;
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
  target?: string
};

export default function Button({
  children,
  type = "button",
  url,
  disabled = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  target
}: ButtonProps) {
  const style = `focus:ring-4 focus:outline-none focus:ring-[#d3d3d39e] bg-primary cursor-pointer text-xs text-white font-medium px-[16px] h-theme flex items-center justify-center rounded-theme hover:bg-primary-hover ${className}`;

  return (
    <>
      {type === "button" && (
        <button
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={style}
          disabled={disabled}
        >
          {children}
        </button>
      )}

      {type === "link" && (
        <Link target={target} href={`${url === undefined ? "#" : url}`} className={style}>
          {children}
        </Link>
      )}
    </>
  );
}
