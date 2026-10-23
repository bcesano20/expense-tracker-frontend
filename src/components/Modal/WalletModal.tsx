import { useState } from 'react'

import type { WalletSummaryInterface } from '../../types'
import { ERROR_MESSAGES, REGEXP } from '../../helpers/constants'
import { formatCurrency } from '../../helpers/utils'
import { Button, Input } from '../index'

interface WalletModalProps {
  isOpen: boolean
  accountName?: string
  currency?: string
  summary: WalletSummaryInterface | null
  onClose: () => void
  onCreate: () => Promise<void>
  onUpdateBalance: (balance: string) => Promise<void>
  loading?: boolean
  loadError?: string | null
}

export const WalletModal = ({
  isOpen,
  accountName,
  currency,
  summary,
  onClose,
  onCreate,
  onUpdateBalance,
  loading = false,
  loadError = null,
}: WalletModalProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [balanceInput, setBalanceInput] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleClose = () => {
    setIsEditing(false)
    setErrors({})
    onClose()
  }

  const handleStartEdit = () => {
    setBalanceInput(String(summary?.walletBalance ?? 0))
    setErrors({})
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setErrors({})
  }

  const handleCreate = async () => {
    try {
      await onCreate()
    } catch {
      setErrors({ submit: ERROR_MESSAGES.WALLET_CREATE_ERROR })
    }
  }

  const handleSubmitBalance = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    // The string is sent as is: the backend parses it as an exact Decimal, never through a float
    const balance = balanceInput.trim()
    if (balance === '') {
      setErrors({ balance: ERROR_MESSAGES.FIELD_REQUIRED })
      return
    }
    if (balance.startsWith('-')) {
      setErrors({ balance: ERROR_MESSAGES.BALANCE_ERROR })
      return
    }
    if (!REGEXP.AMOUNT_REGEX.test(balance)) {
      setErrors({ balance: ERROR_MESSAGES.AMOUNT_FORMAT_ERROR })
      return
    }

    try {
      await onUpdateBalance(balance)
      setIsEditing(false)
      setErrors({})
    } catch {
      setErrors({ submit: ERROR_MESSAGES.WALLET_UPDATE_ERROR })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div className="min-w-0">
            {/* Modal's Title */}
            <h2 className="text-xl font-bold text-gray-900">Billetera</h2>
            {accountName && <p className="text-sm text-gray-500 truncate">{accountName}</p>}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Global error after submit */}
          {errors.submit && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{errors.submit}</div>
          )}

          {!summary ? (
            <div className="text-center py-4 text-gray-500">
              {loadError ?? 'Cargando billetera...'}
            </div>
          ) : !summary.hasWallet ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-4xl">👛</p>
              <p className="text-gray-600">Esta cuenta todavía no tiene una billetera activa.</p>
              <Button onClick={handleCreate} loading={loading} className="w-full">
                Crear billetera
              </Button>
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSubmitBalance} className="space-y-4">
              <Input
                label="Dinero en la billetera *"
                type="number"
                name="balance"
                value={balanceInput}
                onChange={e => {
                  setBalanceInput(e.target.value)
                  if (errors.balance) setErrors(prev => ({ ...prev, balance: '' }))
                }}
                placeholder="0.00"
                step="0.01"
                min="0"
                error={errors.balance}
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelEdit}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" loading={loading} className="flex-1">
                  Guardar
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Dinero en la billetera</p>
                  <p className="text-3xl font-bold text-gray-900 truncate">
                    {formatCurrency(summary.walletBalance ?? 0, currency)}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleStartEdit}
                  title="Editar monto"
                  className="shrink-0 px-3 py-1 text-sm"
                >
                  ✏️
                </Button>
              </div>

              <div className="text-sm text-gray-600 space-y-1 px-1">
                <div className="flex justify-between">
                  <span>Tarjetas de débito</span>
                  <span>{formatCurrency(summary.debitBalance, currency)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total disponible</span>
                  <span>{formatCurrency(summary.totalBalance, currency)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
