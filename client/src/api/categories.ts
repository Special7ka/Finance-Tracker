import type { Category } from '../types/categories'
import { api } from './client'

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>('/categories')
  return res.data
}
