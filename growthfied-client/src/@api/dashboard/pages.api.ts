import { axiosInstance } from "../axios"

export const createPage = async (coupenData: any) => {
    return await axiosInstance.post('/dashboard/pages/create', coupenData)
}

export const getPages = async () => {
    return await axiosInstance.get('/dashboard/pages/get-all')
}

export const deletePage = async (id: string) => {
    return await axiosInstance.put(`/dashboard/pages/delete/${id}`)
}

export const updatePage = async (id: string, editUpdateData: any) => {
    return await axiosInstance.put(`/dashboard/pages/update/${id}`, editUpdateData)
}

export const getSinglePage = async (id: string) => {
    return await axiosInstance.get(`/dashboard/pages/get-single/${id}`)
}