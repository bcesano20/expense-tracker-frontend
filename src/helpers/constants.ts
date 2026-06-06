export const BACKEND_API_ENDPOINTS = {
  // AUTH
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',

  // REPORTS
  GET_SUMMARY_REPORT: 'reports/summary',
  GET_MONTHLY_REPORT: 'reports/monthly',
  GET_CATEGORIES_REPORT: 'reports/category',
  GET_CARDS_REPORT: 'reports/cards',
  GET_COMPARISON_REPORT: 'repotrs/comparison',
}

export const ROUTES = {
  LANDING: '/',
  DASHBOARD: '/dashboard',
  REGISTER: '/register',
  LOGIN: '/login',
  EXPENSES: '/expenses',
  REPORTS: '/reports',
  ACCOUNTS: '/accounts',
  CARDS: '/cards',
}

export const REGEXP = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

export const ERROR_MESSAGES = {
  FIELD_REQUIRED: 'Este campo es requerido',
  LOGIN_ERROR: 'Error al iniciar sesión',
  EMAIL_FORMAT_INVALID: 'El formato de email no es valido',
  REPORTS_LOAD_ERROR: 'Error al cargar el resumen',
}

export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]
