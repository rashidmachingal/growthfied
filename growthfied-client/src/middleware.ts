// middleware.js
import { NextResponse } from 'next/server';
import { DOMAIN_NAME } from '../config';

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: any) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  const subdomain = hostname.split('.')[0];
  const domain = hostname.split('.')[1]
  const tld = hostname.split('.')[2]

  // Handle the custom domain
  // Rewrite to the root while keeping the domain context
  // if (domain + "." + tld !== DOMAIN_NAME) {
  //  return NextResponse.rewrite(new URL(`/${domain}${url.pathname}${url.search}`, req.url));
  // }

  if(subdomain === "www"){
   return NextResponse.next();
  }

  if (domain !== undefined && subdomain) {
  // Rewrite the URL to a dynamic route based on the subdomain
   return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}${url.search}`, req.url));
  }else{
   return NextResponse.next();
  }
}