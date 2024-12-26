import { create } from 'zustand'
import { UserDetailsType } from '@/types/dashboard'
import { getUserDetails } from '@/@api/dashboard/dashboard.api'
import Cookies from "universal-cookie"

export const useUserStore = create<UserDetailsType>()((set) => ({
  username: "",
  domain_name: "",
  is_domain_enabled: false,
  profile_picture: "no_profile",
  on_boarding: true,
  loading: true,
  error: "",
  unauthorized: false,
  update_user: (username, profile_picture, on_boarding) => {
    set(() => ({ username, profile_picture, loading: false, on_boarding }))
  },
  update_unauthorized: () => {
    set((state) => ({ unauthorized: !state.unauthorized }))
  },
  fetch_user: async () => {
    try {
      const res = await getUserDetails()
      set(() => ({ 
        username: res.data.username, 
        domain_name : res.data.domain_name,
        is_domain_enabled: res.data.is_domain_enabled,
        profile_picture: 
        res.data.profile_picture, 
        loading: false, 
        on_boarding: res.data.on_boarding, 
        unauthorized: false
     }))
    } catch (error: any) {
      if(error.response?.status === 401){
        const cookies = new Cookies()
        cookies.remove("token", { path: "/" })
       set(()=> ({ error: error.message, loading: false, unauthorized: true }))
      }
      set(()=> ({ error: error.message, loading: false }))
    }
  }
}))

// update user details when refresh
useUserStore.getState().fetch_user();

