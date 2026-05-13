import { api } from './client'
import type { Summary, SummaryByCategoryItem } from '../types/summary'
import type { GetSummaryFilters } from '../types/summary'

export const getSummary = async (
  filters?: GetSummaryFilters,
): Promise<Summary> => {
  try {
    const res = await api.get<Summary>('/summary', { params: filters })
    return res.data
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const getSummaryByCategory = async (
  filters?: GetSummaryFilters,
): Promise<SummaryByCategoryItem[]> => {
  try {
    const res = await api.get<SummaryByCategoryItem[]>('/summary/by-category', {
      params: filters,
    })
    return res.data
  } catch (e) {
    console.log(e)
    throw e
  }
}
