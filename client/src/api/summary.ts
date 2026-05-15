import { api } from './client'
import type { Summary, SummaryByCategoryItem } from '../types/summary'
import type { GetSummaryFilters } from '../types/summary'

export const getSummary = async (
  filters?: GetSummaryFilters,
): Promise<Summary> => {
  const res = await api.get<Summary>('/summary', { params: filters })
  return res.data
}

export const getSummaryByCategory = async (
  filters?: GetSummaryFilters,
): Promise<SummaryByCategoryItem[]> => {
  const res = await api.get<SummaryByCategoryItem[]>('/summary/by-category', {
    params: filters,
  })
  return res.data
}
