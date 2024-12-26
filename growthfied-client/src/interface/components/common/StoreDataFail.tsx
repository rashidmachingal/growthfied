"use client"

import { Button, Div, Typography } from '@/interface/fragments'
import StoreHomeTopbar from '../layout/store/StoreHomeTopbar'

type StoreDataFailProps = {
  store_name: string
}

export default function StoreDataFail({ store_name }: StoreDataFailProps) {
  return (
    <>
    <StoreHomeTopbar store={{
      store_name: store_name,
      profile_picture: "",
      bio: "",
      display_name: ""
    }} />

    <Div className="flex items-center flex-col gap-2 justify-center mt-[10rem] font-semibold" >
      <Typography className="text-red-500" >Sorry Data Fetching Failed!, Please Try Again</Typography>
      <Button className="bg-red-500" onClick={()=> {
        location.reload()
      }} >Refresh</Button>
    </Div>
    </>
  )
}
