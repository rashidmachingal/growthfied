export type CreateCoupenTypes = {
    coupen_code?: string
    discount?: {
        type: string
        value: number
    },
    minimum: number
    applies?: {
        type: string
        products: any
    },
    end_date?: any,
    count?: number
};

export type EditCoupenTypes = {
    _id?: string,
    fetch_status?: boolean,
    coupen_code?: string
    discount?: {
        type: string
        value: number
    },
    minimum: number
    applies?: {
        type: string
        products: any
    },
    end_date?: any,
    count?: number
    update_edit_coupen_default_data?: (data: any) => void
    update_fetch_status?: (status: boolean) => void
};