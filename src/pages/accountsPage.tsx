import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '../helpers/constants'
import type {
  AccountInterface,
  AccountServiceInterface,
  CardFormInterface,
  CardInterface,
} from '../types'
import { formatCurrency } from '../helpers/utils'
import { useAuth } from '../hooks/useAuth'
import { useAccounts } from '../hooks/useAccounts'
import { useCards } from '../hooks/useCards'
import { Button, Navbar, AccountModal, CardModal, DeleteModal } from '../components'

export const AccountsPage = () => {
  const { state, setActiveAccount } = useAuth()
  const navigate = useNavigate()

  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null)
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false)
  const [selectedAccount, setSelectedAccount] = useState<AccountInterface | null>(null)
  const [showCardModal, setShowCardModal] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<CardInterface | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    title: string
    description: string
    onConfirm: () => Promise<void>
  } | null>(null)

  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useAccounts()

  const activeAccountId = selectedAccountId ?? state.activeAccountId ?? accounts[0]?.id ?? null

  const {
    cards,
    loading: cardsLoading,
    fetchCards,
    createCard,
    updateCard,
    deleteCard,
  } = useCards(activeAccountId)

  // Load accounts on mount
  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  // Load the cards when the account change
  useEffect(() => {
    if (activeAccountId) {
      fetchCards()
    }
  }, [activeAccountId, fetchCards])

  const handleCreateAccount = () => {
    setSelectedAccount(null)
    setShowAccountModal(true)
  }

  const handleEditAccount = (account: AccountInterface) => {
    setSelectedAccount(account)
    setShowAccountModal(true)
  }

  const handleDeleteAccount = (id: number) => {
    setDeleteConfirm({
      title: '¿Eliminar cuenta?',
      description:
        'Se eliminarán también todas las tarjetas y datos asociados. Esta acción no se puede deshacer.',
      onConfirm: async () => {
        await deleteAccount(id)
        await fetchAccounts()
      },
    })
  }

  const handleCreateCard = () => {
    setSelectedCard(null)
    setShowCardModal(true)
  }

  const handleEditCard = (card: CardInterface) => {
    setSelectedCard(card)
    setShowCardModal(true)
  }

  const handleDeleteCard = (id: number) => {
    setDeleteConfirm({
      title: '¿Eliminar tarjeta?',
      description: 'Esta acción no se puede deshacer.',
      onConfirm: async () => {
        await deleteCard(id)
        await fetchCards()
      },
    })
  }

  // Handlers for AccountModal
  const handleCloseAccountModal = () => {
    setShowAccountModal(false)
    setSelectedAccount(null)
  }

  const handleSubmitAccountModal = async (data: AccountServiceInterface) => {
    if (selectedAccount) {
      await updateAccount(selectedAccount.id, data)
    } else {
      await createAccount(data)
    }
    await fetchAccounts()
  }

  // Handlers for CardModal
  const handleCloseCardModal = () => {
    setShowCardModal(false)
    setSelectedCard(null)
  }

  const handleSubmitCardModal = async (data: Partial<CardFormInterface>) => {
    if (selectedCard) {
      await updateCard(selectedCard.id, data)
    } else {
      await createCard({ ...data, accountId: activeAccountId ?? 0 } as CardFormInterface)
    }
    await fetchCards()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <div className="min-w-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Cuentas y Tarjetas</h2>
            </div>
            <Button
              onClick={handleCreateAccount}
              className="shrink-0 whitespace-nowrap bg-blue-600"
            >
              + Cuenta
            </Button>
          </div>
          <p className="text-gray-600">Gestiona tus cuentas y métodos de pago</p>
        </div>

        {/* Cuentas */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Mis Cuentas</h3>

          {accountsError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{accountsError}</div>
          )}

          {accountsLoading ? (
            <div className="text-gray-500">Cargando cuentas...</div>
          ) : accounts.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-600">
              No tienes cuentas. ¡Crea una nueva!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map(account => (
                <div
                  key={account.id}
                  onClick={() => {
                    setSelectedAccountId(account.id)
                    setActiveAccount(account.id)
                  }}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                    activeAccountId === account.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{account.name}</h4>
                      <p className="text-sm text-gray-500">{account.currency}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleEditAccount(account)
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteAccount(account.id)
                        }}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tarjetas */}
        {activeAccountId && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Tarjetas de {accounts.find(a => a.id === activeAccountId)?.name}
              </h3>
              <Button
                onClick={handleCreateCard}
                className="whitespace-nowrap self-end sm:shrink-0 sm:self-auto"
              >
                + Tarjeta
              </Button>
            </div>

            {cardsLoading ? (
              <div className="text-gray-500">Cargando tarjetas...</div>
            ) : cards.length === 0 ? (
              <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-600">
                No hay tarjetas. ¡Agrega una!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cards.map(card => (
                  <div
                    key={card.id}
                    className="p-6 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{card.name}</h4>
                        <p className="text-sm text-gray-500">
                          {card.bank} • {card.network}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          card.type === 'credit'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {card.type === 'credit' ? 'Crédito' : 'Débito'}
                      </span>
                    </div>

                    <div className="mb-4">
                      {card.type === 'credit' && card.closeDay && (
                        <p className="text-sm text-gray-600">Cierre: día {card.closeDay}</p>
                      )}
                      {card.type === 'debit' && card.balance !== undefined && (
                        <p className="text-sm text-gray-600">
                          Saldo:{' '}
                          {formatCurrency(
                            card.balance,
                            accounts.find(a => a.id === activeAccountId)?.currency
                          )}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCard(card)}
                        className="flex-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="flex-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Routes Buttons section */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <Button
                onClick={() => navigate(ROUTES.EXPENSES)}
                className="flex-1 md:h-25 md:text-2xl"
              >
                Gastos de la cuenta
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(ROUTES.INCOMES)}
                className="flex-1 md:h-25 md:text-2xl"
              >
                Ingresos de la cuenta
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AccountModal
        key={selectedAccount?.id ?? 'new account'}
        isOpen={showAccountModal}
        account={selectedAccount}
        onClose={handleCloseAccountModal}
        onSubmit={handleSubmitAccountModal}
        loading={accountsLoading}
      />

      <CardModal
        key={selectedCard?.id ?? 'new card'}
        isOpen={showCardModal}
        card={selectedCard}
        onClose={handleCloseCardModal}
        onSubmit={handleSubmitCardModal}
        loading={cardsLoading}
      />

      <DeleteModal
        isOpen={deleteConfirm !== null}
        title={deleteConfirm?.title ?? ''}
        description={deleteConfirm?.description}
        onConfirm={deleteConfirm?.onConfirm ?? (async () => {})}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  )
}
