import type { Category } from './categories'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  occurredAt: string
  categoryId?: string | null
  category: Category | null
}

export type TransactionTypeFilter = TransactionType | ''

export interface GetTransactionsFilters {
  type?: TransactionTypeFilter
  categoryId?: string
  from?: string
  to?: string
}

export interface TransactionPayload {
  amount: number
  type: TransactionType
  occurredAt: string
  categoryId?: string | null
}
