// zustand
export type StoreDetailsType = {
    fetch_status: boolean
    store_name: string
    profile_picture: string
    description: any
    error: boolean
    fetch_store: (data: any, status: boolean) => void
}