import { BACKEND_API_ENDPOINTS } from '../helpers/constants'
import type { CardInterface, CardFormInterface, ApiResponseInterface } from '../types'
import api from './api'

export const cardsService = {
  getCardsByAccount: async (accountId: number, onlyActive = false) => {
    const response = await api.get<ApiResponseInterface<CardInterface[]>>(
      `${BACKEND_API_ENDPOINTS.GET_CARDS_ACCOUNT}/${accountId}`,
      { params: onlyActive ? { active: true } : undefined }
    )
    return response.data.data || []
  },

  createCard: async (data: CardFormInterface) => {
    const response = await api.post<ApiResponseInterface<CardInterface>>(
      BACKEND_API_ENDPOINTS.CARDS_API_ENDPOINT,
      data
    )
    return response.data.data
  },

  updateCard: async (id: number, data: Partial<CardFormInterface>) => {
    const response = await api.put<ApiResponseInterface<CardInterface>>(
      `${BACKEND_API_ENDPOINTS.CARDS_API_ENDPOINT}/${id}`,
      data
    )
    return response.data.data
  },

  deleteCard: async (id: number) => {
    await api.delete(`${BACKEND_API_ENDPOINTS.CARDS_API_ENDPOINT}/${id}`)
  },

  cancelCard: async (id: number) => {
    await api.patch(`${BACKEND_API_ENDPOINTS.CARDS_API_ENDPOINT}/${id}/cancel`)
  },
}
