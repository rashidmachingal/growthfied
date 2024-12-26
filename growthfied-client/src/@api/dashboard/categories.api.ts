import { axiosInstance } from "../axios"

export const createCategory = async (categoryData: any) => {
    return await axiosInstance.post(`/dashboard/categories/create-category`, categoryData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getCategories = async () => {
    return await axiosInstance.get('/dashboard/categories/get-all')
}

export const getActiveCategories = async () => {
    return await axiosInstance.get('/dashboard/categories/get-active')
}

export const deleteCategory = async (id: string, image: any) => {
    return await axiosInstance.put(`/dashboard/categories/delete/${id}`, { image })
}

export const updateCategoryStatus = async (id: string, status: string) => {
    return await axiosInstance.put(`/dashboard/categories/update-status/${id}`, { status })
}

export const updateCategory = async (id: string, status: any) => {
    return await axiosInstance.put(`/dashboard/categories/update/${id}`, status, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}