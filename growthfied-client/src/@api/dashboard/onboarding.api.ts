import { axiosInstance } from "../axios"

export const completeProfile = async (completeProfileData: any) => {
    return await axiosInstance.put(`/onboarding/complete-profile`, completeProfileData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}