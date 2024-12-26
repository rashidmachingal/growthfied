// components
import { AuthBox, Login } from '@/interface/components'
import { Div, Typography } from '@/interface/fragments'
import Link from 'next/link'

export default function LoginTemplate() {
  return (
    <AuthBox title="Login to your account" >
        <Login/>
        <Div className="flex flex-col mt-5 gap-3" >
      <Typography className="flex items-center justify-center gap-2 text-sm">
        <Link href="/reset-password" className="underline">
          Forgot your password?
        </Link>
      </Typography>
      <Typography className="flex items-center justify-center gap-2 text-sm">
        Create new account?
        <Link href="/create-store" className="underline">
          Sign Up
        </Link>
      </Typography>
      </Div>
    </AuthBox>
  )
}
