type ShoppingCartIconProps = {
  className?: string;
};

export default function ShoppingCartIcon({ className }: ShoppingCartIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={`w-[40px] h-[40px] ${className}`}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 40 40"
      fill="none"
    >
      <path
        d="m15.75 11.8h-3.16l-.77 11.6a5 5 0 0 0 4.99 5.34h7.38a5 5 0 0 0 4.99-5.33l-.78-11.61zm0 1h-2.22l-.71 10.67a4 4 0 0 0 3.99 4.27h7.38a4 4 0 0 0 4-4.27l-.72-10.67h-2.22v.63a4.75 4.75 0 1 1 -9.5 0zm8.5 0h-7.5v.63a3.75 3.75 0 1 0 7.5 0z"
        fill="#121212"
        fillRule="evenodd"
      ></path>
    </svg>
  );
}
