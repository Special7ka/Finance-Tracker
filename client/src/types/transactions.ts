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
