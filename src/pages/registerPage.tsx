import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { ERROR_MESSAGES, REGEXP, ROUTES } from '../helpers/constants'
import { authService } from '../services/authService'
import { Input } from '../components'

interface RegisterData {
  name: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

type FieldErrors = Partial<Record<keyof RegisterData, string>>

export const RegisterPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const isValidForm = (): boolean => {
    const errors: FieldErrors = {}

    if (!formData.name.trim()) errors.name = ERROR_MESSAGES.FIELD_REQUIRED
    if (!formData.lastName.trim()) errors.lastName = ERROR_MESSAGES.FIELD_REQUIRED

    if (!formData.email.trim()) {
      errors.email = ERROR_MESSAGES.FIELD_REQUIRED
    } else if (!REGEXP.EMAIL_REGEX.test(formData.email)) {
      errors.email = ERROR_MESSAGES.EMAIL_FORMAT_INVALID
    }

    if (!REGEXP.PASSWORD_REGEX.test(formData.password)) {
      errors.password = ERROR_MESSAGES.PASSWORD_INVALID_ERROR
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ERROR_MESSAGES.PASSWORD_NOT_MATCH
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name as keyof RegisterData]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError(null)

    if (!isValidForm()) return

    setLoading(true)

    try {
      const response = await authService.register({
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })

      if (response.success) {
        navigate(ROUTES.LOGIN)
      } else {
        setGlobalError(response.message || ERROR_MESSAGES.REGISTER_ERROR)
      }
    } catch (err) {
      if (axios.isAxiosError<{ message: string }>(err)) {
        setGlobalError(err.response?.data?.message || ERROR_MESSAGES.REGISTER_ERROR)
      } else {
        setGlobalError(ERROR_MESSAGES.REGISTER_ERROR)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">SpendWise</h1>
        <p className="text-gray-600 text-center text-sm mb-6">Crea tu cuenta para comenzar</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {globalError && (
            <div className="bg-red-100 text-red-700 p-3 rounded border border-red-400 text-sm">
              {globalError}
            </div>
          )}

          <Input
            label="Nombre"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
            error={fieldErrors.name}
          />

          <Input
            label="Apellido"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Apellido"
            error={fieldErrors.lastName}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@email.com"
            error={fieldErrors.email}
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            error={fieldErrors.password}
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar Contraseña"
            error={fieldErrors.confirmPassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

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
