import { axiosInstance } from "@/@api/axios"

export const getOrders = async (params: any) => {
    return await axiosInstance.get(`/dashboard/orders/get-orders`, { params: params})
}

export const getOrderDetails = async (id: any) => {
    return await axiosInstance.get(`/dashboard/orders/get-order-details/${id}`)
}

export const updateOrderStatus = async (id: any, data: any) => {
    return await axiosInstance.post(`/dashboard/orders/update-order-status/${id}`, data)
}

export const enableTrackingLink = async (id: any, url: any) => {
    return await axiosInstance.post(`/dashboard/orders/enable-tracking-link/${id}`, { url })
}

export const disableTrackingLink = async (id: any) => {
    return await axiosInstance.post(`/dashboard/orders/disable-tracking-link/${id}`)
}

export const cancelOrder = async (id: any, data: any) => {
    return await axiosInstance.post(`/dashboard/orders/cancel-order/${id}`, data)
}

export const reOpenOrder = async (id: any, data: any) => {
    return await axiosInstance.post(`/dashboard/orders/re-open-order/${id}`, data)
}