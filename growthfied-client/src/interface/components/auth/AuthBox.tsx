import { ReactNode } from "react";
import { Div, Section, Typography } from "@/interface/fragments";

type AuthBoxProps = {
    children: ReactNode
    title: string
}

export default function AuthBox({ children, title }: AuthBoxProps) {
  return (
    <Section className="w-full h-[calc(100vh-4.3rem)] flex items-start justify-center bg-cover bg-[url('https://assets-global.website-files.com/5e941e9c459693aeff757d94/645c98db705da28383b76c7d_background.jpg')]">
      <Div className="flex flex-col mt-8 w-[93%] xm:w-[80%] md:w-[30rem] bg-white px-6 py-5 pb-7 rounded-theme shadow-xl">
        <Typography variant="h3" className="font-semibold text-[21px]">{title}</Typography>
        {children}
      </Div>
    </Section>
  );
}
