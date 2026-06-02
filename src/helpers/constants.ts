export const BACKEND_API_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',
}

export const ROUTES = {
  LANDING: '/',
  DASHBOARD: '/dashboard',
  REGISTER: '/register',
  LOGIN: '/login',
}

export const REGEXP = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

export const ERROR_MESSAGES = {
  FIELD_REQUIRED: 'Este campo es requerido',
  LOGIN_ERROR: 'Error al iniciar sesión',
  EMAIL_FORMAT_INVALID: 'El formato de email no es valido',
}
