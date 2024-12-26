import { axiosInstance } from "@/@api/axios"

export const getSearchPrdocuts = async (store_name: string, query: any) => {
    return await axiosInstance.get(`/store/products/search-products/${store_name}/${query}`)
}