import { BACKEND_API_ENDPOINTS } from '../helpers/constants'
import type { ApiResponseInterface, CategoryFormInterface, CategoryInterface } from '../types'
import api from './api'

export const categoryService = {
  getCategories: async () => {
    const response = await api.get<ApiResponseInterface<CategoryInterface[]>>(
      BACKEND_API_ENDPOINTS.CATEGORIES_API_ENDPOINT
    )
    return response.data.data
  },

  createCategory: async (data: Partial<CategoryFormInterface>) => {
    const response = await api.post<ApiResponseInterface<CategoryInterface>>(
      BACKEND_API_ENDPOINTS.CATEGORIES_API_ENDPOINT,
      data
    )
    return response.data.data
  },

  updateCategory: async (id: number, data: Partial<CategoryFormInterface>) => {
    const response = await api.put<ApiResponseInterface<CategoryInterface>>(
      `${BACKEND_API_ENDPOINTS.CATEGORIES_API_ENDPOINT}/${id}`,
      data
    )
    return response.data.data
  },
}
