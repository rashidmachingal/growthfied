import { create } from 'zustand'
import { EditCoupenTypes } from '@/types/dashboard/coupens'

export const useEditCoupenDefaultDataStore = create<EditCoupenTypes>()((set) => ({
    fetch_status: true,
    coupen_code: "",
    applies: {
        type: "",
        products: []
    },
    count: 0,
    discount: {
        type: "",
        value: 0
    },
    minimum: 0,
    update_edit_coupen_default_data: (data: EditCoupenTypes) => {
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

