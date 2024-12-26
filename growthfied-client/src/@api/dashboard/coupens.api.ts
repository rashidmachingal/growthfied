import { axiosInstance } from "../axios"

export const createCoupen = async (coupenData: any) => {
    return await axiosInstance.post('/dashboard/coupens/create-coupen', coupenData)
}

export const getCoupens = async () => {
    return await axiosInstance.get('/dashboard/coupens/get-all')
}

export const deleteCoupen = async (id: string) => {
    return await axiosInstance.put(`/dashboard/coupens/delete/${id}`)
}

export const updateCoupen = async (id: string, editUpdateData: any) => {
    return await axiosInstance.put(`/dashboard/coupens/update/${id}`, editUpdateData)
}

export const getSingleCoupen = async (id: string) => {
    return await axiosInstance.get(`/dashboard/coupens/get-single/${id}`)
}