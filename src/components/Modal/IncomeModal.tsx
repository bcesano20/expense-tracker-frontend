import { useState } from 'react'

import type { IncomeInterface, IncomeFormInterface } from '../../types'
import { Button, Input } from '../index'
import { ERROR_MESSAGES } from '../../helpers/constants'

interface IncomeModalProps {
  isOpen: boolean
  income?: IncomeInterface | null
  onClose: () => void
  onSubmit: (data: IncomeFormInterface) => Promise<void>
  loading?: boolean
}

const DEFAULT_FORM_DATA: IncomeFormInterface = {
  description: '',
  amount: 0,
  source: '',
  date: new Date().toISOString().split('T')[0],
  accountId: 0,
}

export const IncomeModal = ({
  isOpen,
  income,
  onClose,
  onSubmit,
  loading = false,
}: IncomeModalProps) => {
  const [formData, setFormData] = useState<IncomeFormInterface>(
    income
      ? { ...DEFAULT_FORM_DATA, ...income, date: income.date.split('T')[0] }
      : DEFAULT_FORM_DATA
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = ERROR_MESSAGES.FIELD_REQUIRED
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = ERROR_MESSAGES.MORE_0_FIELD
    }
    if (!formData.date) {
      newErrors.date = ERROR_MESSAGES.FIELD_REQUIRED
    }
    if (!formData.source) {
      newErrors.source = ERROR_MESSAGES.FIELD_REQUIRED
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await onSubmit(formData)
      onClose()
    } catch {
      setErrors({ submit: ERROR_MESSAGES.CREATE_INCOME_ERROR })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {income ? 'Editar Ingreso' : 'Registrar Ingreso'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{errors.submit}</div>
          )}

          <Input
            label="Descripción *"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ej: Sueldo de junio, Venta de producto..."
            error={errors.description}
          />

          <Input
            label="Monto ($) *"
            type="number"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            error={errors.amount}
          />

          <Input
            label="Fecha *"
            type="date"
            name="date"
            lang="es"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
          />

          <Input
            label="Fuente *"
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="Ej: Sueldo, Freelance, Alquiler..."
            error={errors.source}
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {income ? 'Actualizar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
