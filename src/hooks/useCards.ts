import { useState, useCallback } from 'react'
import type { CardInterface, CardFormInterface } from '../types'
import { cardsService } from '../services/cardsServices'
import { ERROR_MESSAGES } from '../helpers/constants'

export const useCards = (accountId: number) => {
  const [cards, setCards] = useState<CardInterface[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Get cards from an account
  const fetchCards = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cardsService.getCardsByAccount(accountId)
      setCards(data)
    } catch {
      setError(ERROR_MESSAGES.GET_CARDS_ERROR)
    } finally {
      setLoading(false)
    }
  }, [accountId])

  const createCard = useCallback(async (data: CardFormInterface) => {
    try {
      setLoading(true)
      setError(null)
      const newCard = await cardsService.createCard(data)
      if (newCard) {
        setCards(prev => [newCard, ...prev])
      }
      return newCard
    } catch (err) {
      setError(ERROR_MESSAGES.CREATE_CARD_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCard = useCallback(async (id: number, data: Partial<CardFormInterface>) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await cardsService.updateCard(id, data)
      if (updated) {
        setCards(prev => prev.map(card => (card.id === id ? updated : card)))
      }
      return updated
    } catch (err) {
      setError(ERROR_MESSAGES.UPDATE_CARD_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCard = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await cardsService.deleteCard(id)
      setCards(prev => prev.filter(card => card.id !== id))
    } catch {
      setError(ERROR_MESSAGES.DELETE_CARD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    cards,
    loading,
    error,
    fetchCards,
    createCard,
    updateCard,
    deleteCard,
  }
}
