import type { Category } from './categories'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  occurredAt: string
  categoryId?: string
  category?: Category | null
}
