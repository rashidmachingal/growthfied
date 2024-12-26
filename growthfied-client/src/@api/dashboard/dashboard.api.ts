import { axiosInstance } from "@/@api/axios"

export const getUserDetails = async () => {
    return await axiosInstance.get('/dashboard/common/user-details')
}