import { useState, useCallback } from 'react'

import type { CategoryFormInterface, CategoryInterface } from '../types'
import { categoryService } from '../services/categoryService'
import { ERROR_MESSAGES } from '../helpers/constants'

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryInterface[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryService.getCategories()
      setCategories(data ?? [])
    } catch {
      setError(ERROR_MESSAGES.CATEGORY_LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  const createCategory = useCallback(async (data: CategoryFormInterface) => {
    try {
      setLoading(true)
      setError(null)
      const newCategory = await categoryService.createCategory(data)
      if (newCategory) {
        setCategories(prev => [...prev, newCategory])
      }
      return newCategory
    } catch (err) {
      setError(ERROR_MESSAGES.CATEGORY_CREATION_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCategory = useCallback(async (id: number, data: Partial<CategoryFormInterface>) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await categoryService.updateCategory(id, data)
      if (updated) {
        setCategories(prev => prev.map(cat => (cat.id === id ? updated : cat)))
      }
      return updated
    } catch (err) {
      setError(ERROR_MESSAGES.CATEGORY_UPDATE_ERROR)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
  }
}
