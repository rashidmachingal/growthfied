import { axiosInstance } from "../axios"

export const getStoreDetails = async (username: string) => {
    return await axiosInstance.get(`/store/common/get-store-details/${username}`)
}
