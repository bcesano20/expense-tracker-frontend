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

  // ACCOUNTS
  ACCOUNTS: '/accounts',

  // EXPENSES
  // This is the basic route, according the method that is call the route is different, also has another effect if the method and a param is passed
  EXPENSE_BASIC_API_ROUTE: '/expenses',
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
  EXPENSES_LOAD_ERROR: 'Error al cargar los gastos',
  EXPENSE_GET_ERROR: 'Error al recuperar el gasto',
  CREATE_EXPENSE_ERROR: 'Error al crear el gasto',
  UPDATE_EXPENSE_ERROR: 'Error al actualizar el gasto',
  DELETE_EXPENSE_ERROR: 'Error al eliminar el gasto',
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
