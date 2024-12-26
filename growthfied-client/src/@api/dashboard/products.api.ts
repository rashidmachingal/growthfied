import { axiosInstance } from "@/@api/axios"

export const createProduct = async (productData: any) => {
    return await axiosInstance.post(`/dashboard/products/create-product`, productData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const editProduct = async (editProductData: any) => {
    return await axiosInstance.put(`/dashboard/products/edit-product`, editProductData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getProducts = async () => {
    return await axiosInstance.get('/dashboard/products/get-all')
}

export const getSingleProduct = async (id: string) => {
    return await axiosInstance.get(`/dashboard/products/get-single/${id}`)
}

export const updateProductStatus = async (id: string, status: string) => {
    return await axiosInstance.put(`/dashboard/products/update-status/${id}`, { status })
}

export const deleteProduct = async (id: string, data: any) => {
    return await axiosInstance.put(`/dashboard/products/delete/${id}`, data)
}