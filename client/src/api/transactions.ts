import { api } from './client'
import type { Transaction } from '../types/transactions'
import type {
  GetTransactionsFilters,
  TransactionPayload,
} from '../types/transactions'

export const getTransactions = async (filters?: GetTransactionsFilters) => {
  const res = await api.get<{ transactions: Transaction[] }>('/transactions', {
    params: filters,
  })
  return res.data.transactions
}

export const deleteTransaction = async (id: string) => {
  await api.delete('/transactions/' + id)
}

export const createTransaction = async (data: TransactionPayload) => {
  const res = await api.post('/transactions', data)
  return res.data
}

export const updateTransaction = async (
  id: string,
  data: TransactionPayload,
) => {
  const res = await api.put('/transactions/' + id, data)
  return res.data
}
