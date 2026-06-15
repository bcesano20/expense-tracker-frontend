import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { ERROR_MESSAGES, REGEXP, ROUTES } from '../helpers/constants'
import { authService } from '../services/authService'

interface RegisterData {
  name: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export const RegisterPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Valid form
  const isValidForm = (): boolean => {
    if (!formData.name.trim()) {
      setError(ERROR_MESSAGES.FIELD_REQUIRED)
      return false
    }

    if (!formData.lastName.trim()) {
      setError(ERROR_MESSAGES.FIELD_REQUIRED)
      return false
    }

    if (!formData.email.trim()) {
      setError(ERROR_MESSAGES.FIELD_REQUIRED)
      return false
    }

    if (!REGEXP.EMAIL_REGEX.test(formData.email)) {
      setError(ERROR_MESSAGES.EMAIL_FORMAT_INVALID)
      return false
    }

    if (formData.password.length < 6) {
      setError(ERROR_MESSAGES.PASSWORD_INVALID_ERROR)
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError(ERROR_MESSAGES.PASSWORD_NOT_MATCH)
      return false
    }

    return true
  }

  // Handle the inputs changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clean the error when the user starts to write
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidForm()) return

    setLoading(true)

    try {
      const body = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }

      const response = await authService.register(body)

      // routes to login for sign in
      if (response.success) {
        navigate(ROUTES.LOGIN)
      } else {
        setError(response.message || ERROR_MESSAGES.REGISTER_ERROR)
      }
    } catch (err) {
      if (axios.isAxiosError<{ message: string }>(err)) {
        setError(err.response?.data?.message || ERROR_MESSAGES.REGISTER_ERROR)
      } else {
        setError(ERROR_MESSAGES.REGISTER_ERROR)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Expense Tracker</h1>
        <p className="text-gray-600 text-center text-sm mb-6">Crea tu cuenta para comenzar</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded border border-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Lastname */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Apellido"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Confirm */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar Contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-center mt-4 text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <a href={ROUTES.LOGIN} className="text-blue-600 hover:underline font-medium">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  )
}
