import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { ERROR_MESSAGES, REGEXP, ROUTES } from '../helpers/constants'
import { type LoginRequestInterface } from '../types'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { Button, Input, Link } from '../components'

const LOGIN_DEFAULT_DATA: LoginRequestInterface = {
  email: '',
  password: '',
}

type LoginFormErrors = Partial<Record<keyof LoginRequestInterface, string>>

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState<LoginRequestInterface>(LOGIN_DEFAULT_DATA)
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const isValidForm = (): boolean => {
    const errors: LoginFormErrors = {}

    if (!loginData.email) {
      errors.email = ERROR_MESSAGES.FIELD_REQUIRED
    } else if (!REGEXP.EMAIL_REGEX.test(loginData.email)) {
      errors.email = ERROR_MESSAGES.EMAIL_FORMAT_INVALID
    }

    if (!loginData.password) {
      errors.password = ERROR_MESSAGES.FIELD_REQUIRED
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setLoginData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidForm()) return

    setLoading(true)

    try {
      const response = await authService.login(loginData)

      if (!response.success || !response.data || !response.token) {
        setError(response.message || ERROR_MESSAGES.LOGIN_ERROR)
        return
      }

      login({ user: response.data, token: response.token })
      navigate(ROUTES.ACCOUNTS)
    } catch (err) {
      if (axios.isAxiosError<{ message: string }>(err)) {
        setError(err.response?.data?.message || ERROR_MESSAGES.LOGIN_ERROR)
      } else {
        setError(ERROR_MESSAGES.LOGIN_ERROR)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Gestion de Gastos</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          <Input
            label="Email"
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            error={formErrors.email}
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            error={formErrors.password}
          />

          <Button type="submit" loading={loading} className="w-full">
            Iniciar sesión
          </Button>
        </form>

        <p className="text-center mt-4 text-sm">
          ¿No tienes cuenta?{' '}
          <Link linkTo={ROUTES.REGISTER} className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
