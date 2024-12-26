import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { OpenInChrome, ProgressBar, ToastComponent } from "@/interface/components";
import Script from "next/script";
import "../../globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Growthfied - Create Your e-commerce Website Easily",
  description: "Build your e-commerce website quickly and easily with Growthfied. Our user-friendly platform simplifies every step, empowering you to launch your online store effortlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-D5MRSQ7XSQ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-D5MRSQ7XSQ');
        `}
      </Script>
      <OpenInChrome/>

      <body className={inter.className} >
        {children}
        <ToastComponent/>
        <ProgressBar/>
      </body>
    </html>
  );
}
