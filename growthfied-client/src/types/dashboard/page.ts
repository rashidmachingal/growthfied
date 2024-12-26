export type CreatePageTypes = {
    page_title: string
    page_content: string
};

export type EditPageTypes = {
    _id?: string,
    fetch_status?: boolean,
    page_title: string
    page_content: string
    update_edit_page_default_data?: (data: any) => void
    update_fetch_status?: (status: boolean) => void
};