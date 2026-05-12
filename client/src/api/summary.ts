import { api } from './client'
import type { Summary } from '../types/summary'
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
