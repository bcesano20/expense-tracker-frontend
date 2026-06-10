import { useState } from 'react'

import type { CardFormInterface, CardInterface } from '../../types'
import { ERROR_MESSAGES } from '../../helpers/constants'

interface CardModalProps {
  isOpen: boolean
  card?: CardInterface | null
  onClose: () => void
  onSubmit: (data: Partial<CardFormInterface>) => Promise<void>
  loading?: boolean
}

const DEFAULT_CARD_DATA: CardFormInterface = {
  name: '',
  bank: '',
  type: 'debit',
  network: 'visa',
  closeDay: 25,
  balance: 0,
  accountId: 0,
}

export const CardModal = ({ isOpen, card, onClose, onSubmit, loading = false }: CardModalProps) => {
  const [formData, setFormData] = useState<Partial<CardFormInterface>>(
    card
      ? {
          name: card.name,
          bank: card.bank,
          type: card.type,
          network: card.network,
          balance: card.balance,
          closeDay: card.closeDay,
          accountId: card.accountId,
        }
      : DEFAULT_CARD_DATA
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = ERROR_MESSAGES.FIELD_REQUIRED
    }

    if (!formData.bank || !formData.bank.trim()) {
      newErrors.bank = ERROR_MESSAGES.FIELD_REQUIRED
    }

    if (
      formData.type === 'credit' &&
      (!formData.closeDay || formData.closeDay < 1 || formData.closeDay > 31)
    ) {
      newErrors.closeDay = ERROR_MESSAGES.CLOSE_DATE_LIMIT_ERROR
    }

    if (formData.type === 'debit' && (!formData.balance || formData.balance < 0)) {
      newErrors.balance = ERROR_MESSAGES.BALANCE_ERROR
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'closeDay' || name === 'balance') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || (name === 'balance' ? 0 : 25),
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await onSubmit(formData)
      onClose()
    } catch {
      setErrors({ submit: ERROR_MESSAGES.OPERATION_ACCOUNT_ERROR })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {card ? 'Editar Tarjeta' : 'Crear Nueva Tarjeta'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{errors.submit}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="Ej: Visa Crédito"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banco *</label>
            <input
              type="text"
              name="bank"
              value={formData.bank || ''}
              onChange={handleChange}
              placeholder="Ej: Banco XYZ"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.bank
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.bank && <p className="text-red-500 text-xs mt-1">{errors.bank}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select
              name="type"
              value={formData.type || 'credit'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="credit">Crédito</option>
              <option value="debit">Débito</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Red *</label>
            <select
              name="network"
              value={formData.network || 'visa'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="amex">Amex</option>
              <option value="discover">Discover</option>
            </select>
          </div>

          {formData.type === 'credit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Día de Cierre *
              </label>
              <input
                type="number"
                name="closeDay"
                value={formData.closeDay || 25}
                onChange={handleChange}
                min="1"
                max="31"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.closeDay
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.closeDay && <p className="text-red-500 text-xs mt-1">{errors.closeDay}</p>}
            </div>
          )}

          {formData.type === 'debit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Saldo Inicial ($) *
              </label>
              <input
                type="number"
                name="balance"
                value={formData.balance || 0}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.balance
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.balance && <p className="text-red-500 text-xs mt-1">{errors.balance}</p>}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
            >
              {loading ? 'Guardando...' : card ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
