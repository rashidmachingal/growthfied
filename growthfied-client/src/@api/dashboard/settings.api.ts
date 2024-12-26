import { axiosInstance } from "@/@api/axios"

export const updateUsername = async (username: any) => {
    return await axiosInstance.put('/dashboard/settings/update-username', username)
}

export const getDefaultDeliveryCharge = async () => {
    return await axiosInstance.get('/dashboard/settings/default-delivery-charge')
}

export const updateDeliveryCharge = async (delivery_charge: number) => {
    return await axiosInstance.put('/dashboard/settings/update-delivery-charge', { delivery_charge })
}

export const getProfileInfo = async () => {
    return await axiosInstance.get('/dashboard/settings/profile-info')
}

export const getStoreDetails = async () => {
    return await axiosInstance.get('/dashboard/settings/get-store-details')
}

export const getPaymentMethodInfo = async () => {
    return await axiosInstance.get('/dashboard/settings/get-payment-method-info')
}

export const switchCod = async (cod: boolean) => {
    return await axiosInstance.put('/dashboard/settings/switch-cod', { cod })
}

export const enabledPhonePePg = async (data: any) => {
    return await axiosInstance.post('/dashboard/settings/enable-razorpay-pg', data)
}

export const disableOnlinePayment = async () => {
    return await axiosInstance.post('/dashboard/settings/disable-online-payment')
}

export const updateProfileInfo = async (formData: any) => {
    return await axiosInstance.put('/dashboard/settings/update-profile-info', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const updateSeoInfo = async (formData: any) => {
    return await axiosInstance.put('/dashboard/settings/update-seo-info', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getFooterInfo = async () => {
    return await axiosInstance.get('/dashboard/settings/get-footer-info')
}

export const updateFooterInfo = async (data: any) => {
    return await axiosInstance.put('/dashboard/settings/update-footer-info', data)
}