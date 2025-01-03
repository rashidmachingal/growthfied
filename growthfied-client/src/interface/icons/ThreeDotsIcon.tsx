type ThreeDotsIconProps = {
    className?: string
}

export default function ThreeDotsIcon({ className }: ThreeDotsIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-[15px] w-[15px] ${className}`}
      viewBox="0 0 20 20"
      fill="#333"
    >
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );
}
