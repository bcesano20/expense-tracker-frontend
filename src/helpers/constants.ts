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
  GET_COMPARISON_REPORT: 'reports/comparison',

  // ACCOUNTS
  ACCOUNTS: '/accounts',

  // EXPENSES
  // This is the basic route, according the method that is call the route is different, also has another effect if the method and a param is passed
  EXPENSE_BASIC_API_ROUTE: '/expenses',

  // CARDS
  GET_CARDS_ACCOUNT: '/cards/account',
  CARDS_API_ENDPOINT: '/cards',

  // CATEGORIES
  CATEGORIES_API_ENDPOINT: '/categories',
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
  PASSWORD_INVALID_ERROR: 'La contraseña debe tener al menos 6 caracteres',
  PASSWORD_NOT_MATCH: 'Las contraseñas no coinciden',
  REGISTER_ERROR: 'Error al registrarse',
  MONTHLY_REPORT_ERROR: 'Error al cargar el reporte mensual',
  COMPARISION_ERROR: 'Error al obtener la comparativa',
  ACCOUNTS_LOAD_ERROR: 'Error al traer cuentas',
  CREATE_ACCOUNT_ERROR: 'Error al crear una cuenta',
  UPDATE_ACCOUNT_ERROR: 'Error al actualizar la cuenta',
  DELETE_ACCOUNT_ERROR: 'Error al eliminar la cuenta',
  OPERATION_ACCOUNT_ERROR: 'Error al guardar, intenta de nuevo',
  GET_CARDS_ERROR: 'Error al traer tarjetas de esta cuenta',
  CREATE_CARD_ERROR: 'Error al crear la tarjeta',
  UPDATE_CARD_ERROR: 'Error al actualizar esta tarjeta',
  DELETE_CARD_ERROR: 'Erro al eliminar esta tarjeta',
  CLOSE_DATE_LIMIT_ERROR: 'El día de cierre debe estar entre 1 y 31',
  BALANCE_ERROR: 'El saldo debe ser mayor o igual a 0',
  CATEGORY_LOAD_ERROR: 'Error al cargar las categorias',
  CATEGORY_CREATION_ERROR: 'Error al crear la categoria',
  CATEGORY_UPDATE_ERROR: 'Error al actualizar la categoria',
  SAVE_CATEGORY_ERROR: 'Error al guardar la categoria. Intenta de nuevo',
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
