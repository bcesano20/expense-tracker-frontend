import axios, { type AxiosInstance } from 'axios'
import { ROUTES } from '../helpers/constants'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add the token in each request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercept errors
api.interceptors.response.use(
  response => response,
  error => {
    const hadToken = localStorage.getItem('token')
    if (error.response?.status === 401 && hadToken) {
      // Only redirect if the user had an active session (expired token)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = ROUTES.LOGIN
    }
    return Promise.reject(error)
  }
)

export default api
