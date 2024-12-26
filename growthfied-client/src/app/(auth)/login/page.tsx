// template
import { LoginTemplate } from '@/interface/templates'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login to Growthfied",
  description: "Login to Growthfied Dashboard",
};


export default function Page() {
  return <LoginTemplate/>
}
