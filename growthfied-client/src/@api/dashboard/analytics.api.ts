import { axiosInstance } from "@/@api/axios"

export const getOrderAnalytics = async (params: any) => {
    return await axiosInstance.get('/dashboard/analytics/order-analytics', { params: params })
}
export const getSiteAnalytics = async (params: any) => {
    return await axiosInstance.get('/dashboard/analytics/site-analytics', { params: params })
}