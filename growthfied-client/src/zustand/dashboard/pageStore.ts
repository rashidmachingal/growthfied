import { create } from 'zustand'
import { EditPageTypes } from '@/types/dashboard/page'

export const useEditPageDefaultDataStore = create<EditPageTypes>()((set) => ({
    fetch_status: true,
    page_title: "",
    page_content: "",
    update_edit_page_default_data: (data: EditPageTypes) => {
        set(() => ({
            ...data
        }))
      },
    update_fetch_status: (status) => {
        set(() => ({
          fetch_status: status
        }))
    },
  }))

