import { useState } from 'react'

import { ERROR_MESSAGES } from '../../helpers/constants'
import type { BudgetInterface, BudgetFormInterface, CategoryInterface } from '../../types'
import { Button, Input, Select } from '../index'

interface BudgetModalProps {
  isOpen: boolean
  budget?: BudgetInterface | null
  month: number
  year: number
  accountId: number
  onClose: () => void
  onSubmit: (data: BudgetFormInterface) => Promise<void>
  loading?: boolean
  categories: CategoryInterface[]
  onCreateCategory?: () => void
  onEditCategory?: (category: CategoryInterface) => void
}

type BudgetType = 'fixed' | 'range'

interface FormState {
  categoryId: number | undefined
  budgetType: BudgetType
  amount: number
  minAmount: number
  maxAmount: number
}

const DEFAULT_BUDGET_FORM: FormState = {
  categoryId: undefined,
  budgetType: 'fixed',
  amount: 0,
  minAmount: 0,
  maxAmount: 0,
}

export const BudgetModal = ({
  isOpen,
  budget,
  month,
  year,
  accountId,
  onClose,
  onSubmit,
  loading = false,
  categories,
  onCreateCategory,
  onEditCategory,
}: BudgetModalProps) => {
  const [formData, setFormData] = useState<FormState>(
    budget
      ? {
          categoryId: budget.categoryId,
          budgetType: budget.amount != null ? 'fixed' : 'range',
          amount: budget.amount ?? 0,
          minAmount: budget.minAmount ?? 0,
          maxAmount: budget.maxAmount ?? 0,
        }
      : DEFAULT_BUDGET_FORM
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.categoryId) {
      newErrors.categoryId = ERROR_MESSAGES.FIELD_REQUIRED
    }
    if (formData.budgetType === 'fixed' && formData.amount <= 0) {
      newErrors.amount = ERROR_MESSAGES.MORE_0_FIELD
    }
    if (formData.budgetType === 'range') {
      if (formData.minAmount <= 0) newErrors.minAmount = ERROR_MESSAGES.MORE_0_FIELD
      if (formData.maxAmount <= 0) newErrors.maxAmount = ERROR_MESSAGES.MORE_0_FIELD
      if (formData.maxAmount > 0 && formData.minAmount >= formData.maxAmount) {
        newErrors.maxAmount = 'El máximo debe ser mayor al mínimo'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    const data: BudgetFormInterface = {
      accountId,
      categoryId: formData.categoryId!,
      month,
      year,
      ...(formData.budgetType === 'fixed'
        ? { amount: formData.amount }
        : { minAmount: formData.minAmount, maxAmount: formData.maxAmount }),
    }

    try {
      await onSubmit(data)
      onClose()
    } catch {
      setErrors({ submit: ERROR_MESSAGES.CREATE_BUDGET_ERROR })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {budget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(year, month - 1).toLocaleString('es', { month: 'long', year: 'numeric' })}
            </p>
          </div>
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

          {/* Category selector */}
          <Select
            label="Categoría *"
            name="categoryId"
            value={formData.categoryId ? String(formData.categoryId) : ''}
            onChange={e => {
              const id = e.target.value ? Number(e.target.value) : undefined
              setFormData(prev => ({ ...prev, categoryId: id }))
              if (errors.categoryId) setErrors(prev => ({ ...prev, categoryId: '' }))
            }}
            error={errors.categoryId}
            labelActions={
              <div className="flex gap-1">
                {onCreateCategory && (
                  <button
                    type="button"
                    onClick={onCreateCategory}
                    title="Nueva categoría"
                    className="text-blue-600 hover:text-blue-800 text-lg leading-none px-1"
                  >
                    +
                  </button>
                )}
                {onEditCategory && formData.categoryId && (
                  <button
                    type="button"
                    onClick={() => {
                      const selected = categories.find(c => c.id === formData.categoryId)
                      if (selected) onEditCategory(selected)
                    }}
                    title="Editar categoría"
                    className="text-gray-500 hover:text-gray-700 text-sm leading-none px-1"
                  >
                    ✏️
                  </button>
                )}
              </div>
            }
          >
            <option value="">
              {categories.length === 0
                ? 'Sin categorías — crea una con el botón +'
                : 'Seleccioná una categoría'}
            </option>
            {categories.map(cat => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
            ))}
          </Select>

          {/* Budget type */}
          <Select
            label="Tipo de presupuesto"
            name="budgetType"
            value={formData.budgetType}
            onChange={e =>
              setFormData(prev => ({ ...prev, budgetType: e.target.value as BudgetType }))
            }
          >
            <option value="fixed">Monto fijo</option>
            <option value="range">Rango (mínimo / máximo)</option>
          </Select>

          {/* Fixed amount */}
          {formData.budgetType === 'fixed' && (
            <Input
              label="Monto ($) *"
              type="number"
              name="amount"
              value={formData.amount || ''}
              onChange={handleNumberChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              error={errors.amount}
            />
          )}

          {/* Range amounts */}
          {formData.budgetType === 'range' && (
            <>
              <Input
                label="Monto mínimo ($) *"
                type="number"
                name="minAmount"
                value={formData.minAmount || ''}
                onChange={handleNumberChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                error={errors.minAmount}
              />
              <Input
                label="Monto máximo ($) *"
                type="number"
                name="maxAmount"
                value={formData.maxAmount || ''}
                onChange={handleNumberChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                error={errors.maxAmount}
              />
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {budget ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
