import { axiosInstance } from "@/@api/axios"

export const checkUsername = async (username: string) => {
    return await axiosInstance.post('/auth/check-username', { username })
}

export const userSignup = async (signUpData: any) => {
    return await axiosInstance.post('/auth/signup', signUpData)
}

export const userLogin = async (loginData: any) => {
    return await axiosInstance.post('/auth/login', loginData)
}

export const checkCurrentPasswordValid = async (current_password: string) => {
    return await axiosInstance.put('/auth/check-current-password-valid', { current_password })
}

export const updatePassword = async (new_password: string, current_password: string, otp: any) => {
    return await axiosInstance.put('/auth/update-password', { new_password, current_password, otp })
}

export const updateEmail = async (new_email: string, otp: any, current_email: string) => {
    return await axiosInstance.put('/auth/update-email', { new_email, otp, current_email })
}

export const userLogout = async () => {
    return await axiosInstance.post('/auth/logout')
}

export const sentOtp = async (email: string) => {
    return await axiosInstance.post('/auth/sent-otp', { email })
}

export const submitOtp = async (email: string, otp: string) => {
    return await axiosInstance.post('/auth/submit-otp', { email, otp })
}

export const forgotResetPassword = async (email: string, otp: string, new_password: string) => {
    return await axiosInstance.put('/auth/forgot-reset-password', { email, otp, new_password })
}