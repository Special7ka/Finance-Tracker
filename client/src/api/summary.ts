import { api } from './client'
import type { Summary } from '../types/summary'

export const getSummary = async (): Promise<Summary> => {
  try {
    const res = await api.get('/summary')
    return res.data
  } catch (e) {
    console.log(e)
    throw e
  }
}
