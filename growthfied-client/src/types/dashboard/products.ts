export type CreateProductTypes = {
    status: string;
    title: string;
    description: string;
    images: {
        image_one: any,
        image_two: any,
        image_three: any
    },
    temporary_image_urls: {
        image_one: string | null,
        image_two: string | null,
        image_three: string | null
    }
    selling_price: number;
    original_price: number;
    discount_based_pm: {
        allow: boolean
        payment_method: string,
        selling_price: number,
    }
    quantity: any;
    limit_per_order: {
        minimum: number;
        maximum: number;
    };
    delivery_days: number;
    delivery_charge: string;
    variants: {
        variant_name: string;
        options: { 
            option_one: any,
            option_two: any,
            option_three: any,
            option_four: any
        }
        options_quantity: {
            option_one: any,
            option_two: any,
            option_three: any,
            option_four: any,
        }
    };
    accept_images: {
        allow: boolean;
        number: number;
    };
    accept_message: {
        allow: boolean
        label: string
        required: boolean
    }
    seo: {
        allow: boolean
        meta_title: string
        meta_description: string
    }
    categories: string[];
    payment_methods: {
        cod: boolean;
        online: boolean;
    };
    slug: string;
};

// zustand
export type EditProductTypes = {
    fetch_status?: boolean;
    status: string;
    title: string;
    description: string;
    images: {
        image_one: any,
        image_two: any,
        image_three: any
    },
    prev_images: {
        image_one: any
        image_two: any
        image_three: any
    },
    temporary_image_urls: {
        image_one: string | null,
        image_two: string | null,
        image_three: string | null
    }
    selling_price: number;
    original_price: number;
    discount_based_pm: {
        allow: boolean
        payment_method: string,
        selling_price: number,
    }
    quantity: any;
    limit_per_order: {
        minimum: number;
        maximum: number;
    };
    delivery_days: number;
    delivery_charge: string;
    variants: {
        variant_name: string;
        options: { 
            option_one: any,
            option_two: any,
            option_three: any,
            option_four: any
        }
        options_quantity: {
            option_one: any,
            option_two: any,
            option_three: any,
            option_four: any,
        }
    };
    accept_images: {
        allow: boolean;
        number: number;
    };
    accept_message: {
        allow: boolean
        label: string
        required: boolean
    }
    seo: {
        allow: boolean
        meta_title: string
        meta_description: string
    }
    categories: string[];
    payment_methods: {
        cod: boolean;
        online: boolean;
    };
    slug: string;
    update_edit_product_default_data?: (data: any) => void
    update_fetch_status?: (status: boolean) => void
    update_price?: (selling_price: number, original_price: number) => void
};