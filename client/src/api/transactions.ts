import { api } from './client'
import type { Transaction } from '../types/transactions'
import type { GetTransactionsFilters } from '../types/transactions'

export const getTransactions = async (filters?: GetTransactionsFilters) => {
  const res = await api.get<{ transactions: Transaction[] }>('/transactions', {
    params: filters,
  })
  return res.data.transactions
}

export const deleteTransaction = async (id: string) => {
  await api.delete('/transactions/' + id)
}
