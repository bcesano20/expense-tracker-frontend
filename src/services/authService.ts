import api from './api'

import { BACKEND_API_ENDPOINTS } from '../helpers/constants'
import {
  type User,
  type ApiResponse,
  type PayloadInterface,
  type RegisterRequestInterface,
  type LoginRequestInterface,
} from '../types'

export const authService = {
  register: async (req: RegisterRequestInterface) => {
    const response = await api.post<ApiResponse<PayloadInterface>>(
      BACKEND_API_ENDPOINTS.REGISTER,
      req
    )
    return response.data
  },

  login: async (req: LoginRequestInterface) => {
    const response = await api.post<ApiResponse<PayloadInterface>>(BACKEND_API_ENDPOINTS.LOGIN, req)
    return response.data
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>(BACKEND_API_ENDPOINTS.PROFILE)
    return response.data
  },
}
