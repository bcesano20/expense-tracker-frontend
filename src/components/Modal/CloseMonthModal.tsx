import { useState } from 'react'

import type { ClosingPreviewInterface } from '../../types'
import {
  CLOSING_BLOCK_MESSAGES,
  ERROR_MESSAGES,
  WALLET_REQUIRED_TO_CLOSE_MESSAGE,
} from '../../helpers/constants'
import { formatCurrency } from '../../helpers/utils'
import { Button } from '../index'

interface CloseMonthModalProps {
  isOpen: boolean
  monthName: string
  year: number
  preview: ClosingPreviewInterface | null
  onConfirm: () => Promise<void>
  onClose: () => void
  currency?: string
  loading?: boolean
  loadError?: string | null
}

export const CloseMonthModal = ({
  isOpen,
  monthName,
  year,
  preview,
  onConfirm,
  onClose,
  currency,
  loading = false,
  loadError = null,
}: CloseMonthModalProps) => {
  const [closing, setClosing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleClose = () => {
    if (closing) return
    setError(null)
    onClose()
  }

  const handleConfirm = async () => {
    setError(null)
    setClosing(true)
    try {
      await onConfirm()
      onClose()
    } catch (err) {
      // The message comes from the backend (the installments changed, the month is closed...)
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.CLOSE_MONTH_ERROR)
    } finally {
      setClosing(false)
    }
  }

  // Why the month can't be closed, or null when it can
  const getBlockMessage = (data: ClosingPreviewInterface) => {
    if (data.isClosed) return 'Este mes ya está cerrado.'
    if (!data.hasWallet) return WALLET_REQUIRED_TO_CLOSE_MESSAGE
    if (!data.firstFailure) return null

    const message = CLOSING_BLOCK_MESSAGES[data.firstFailure]
    return data.firstFailure === 'INSTALLMENTS_UNPAID'
      ? `${message} (pendientes: ${data.pendingInstallments}).`
      : `${message}.`
  }

  const renderContent = () => {
    if (!preview) {
      return (
        <p className="text-sm text-gray-500 text-center py-4">
          {loadError ?? 'Cargando cierre de mes...'}
        </p>
      )
    }

    const blockMessage = getBlockMessage(preview)
    const savings = preview.savings.amount

    return (
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Ahorro</span>
          <span className={`text-xl font-bold ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(savings, currency)}
          </span>
        </div>

        {blockMessage ? (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{blockMessage}</div>
        ) : (
          <p className="text-sm text-gray-500">
            Al cerrar el mes se guarda el ahorro y ya no se podrán crear, editar ni eliminar gastos
            ni ingresos de ese mes. La billetera no se modifica. Esta acción no se puede deshacer.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Cerrar balance de {monthName} {year}
        </h2>

        {renderContent()}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mt-4">{error}</div>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={handleClose} disabled={closing} className="flex-1">
            Cancelar
          </Button>
          <Button
            loading={closing}
            disabled={loading || !preview?.canClose}
            onClick={handleConfirm}
            className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cerrar Mes
          </Button>
        </div>
      </div>
    </div>
  )
}
