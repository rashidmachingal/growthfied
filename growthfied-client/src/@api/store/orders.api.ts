import { axiosInstance } from "../axios"

export const uploadUserPhotos = async (photosData: any) => {
    return await axiosInstance.post(`/store/orders/upload-customer-photos`, photosData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getDefaultDeliveryChargeAndPM = async (username:string) => {
    return await axiosInstance.get(`/store/orders/default-delivery-charge-and-pm/${username}`)
}

export const getCoupenStatus = async (username:string, coupen_code: string) => {
    return await axiosInstance.get(`/store/orders/coupen-status/${username}/${coupen_code}`)
}

export const placeOrder = async (orderData: any) => {
    return await axiosInstance.post(`/store/orders/place-order`, orderData)
}

export const verifyRazorpayPayment = async (orderData: any) => {
    return await axiosInstance.post(`/store/orders/verify-razorpay-payment`, orderData)
}

export const trackOrder = async (query: any) => {
    return await axiosInstance.get(`/store/orders/track-order`, { params: query })
}