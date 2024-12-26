export type UpdateUsernameTypes = {
    username: string
}

export type UpdateEmailTypes = {
    email: string
}
  
export type UpdateProfileInfoDataTypes = {
    store_name: string;
    profile_picture: any;
    temporary_profile_url: string | null
    is_no_profile: string
    prev_profile: string
    bio: string;
    mobile_number: number;
    whatsapp_number: number;
}

export type UpdateSeoInfoDataTypes = {
    meta_title: string
    meta_description: string
    favicon: any
    prev_favicon: string
    temporary_favicon_url: string | null
}

export type UpdatePasswordDataTypes = {
    current_password: string
    new_password: string
    confirm_password: string
}

export type UpdatePaymentMethodDataTypes = {
    cod: boolean
    online: {
        enabled: boolean
        pg_name: string
    }
}
