import { create } from 'zustand'
import { WelcomeMessageType } from '@/types/dashboard'

export const useWelcomeMessage = create<WelcomeMessageType>()((set) => ({
    welcome: false,
    update_welcome: (status) => {
        set(()=> ({ welcome: status }))
    }
  }))

