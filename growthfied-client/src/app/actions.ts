'use server'
 
import { revalidateTag } from 'next/cache'
 
export async function revalidateServerAction(tag: "store" | "product" | "category") {
  revalidateTag(tag)
}