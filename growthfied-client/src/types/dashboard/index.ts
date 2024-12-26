// zustand
export type UserDetailsType = {
    username: string
    domain_name: string
    is_domain_enabled: boolean
    profile_picture: string
    on_boarding: boolean
    loading: boolean
    error: string
    unauthorized: boolean
    update_user: (username: string, profile_picture: string, on_boarding: boolean) => void
    update_unauthorized: () => void
    fetch_user: () => void
}

export type WelcomeMessageType = {
    welcome: boolean
    update_welcome: (status: boolean) => void
}

