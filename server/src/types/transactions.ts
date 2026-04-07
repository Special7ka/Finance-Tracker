import { TransactionType } from '@prisma/client'

export interface CreateTransactionValidated {
  amount: number
  type: TransactionType
  occurredAt: Date
  categoryId?: string
}

export interface UpdateTransactionValidated {
  amount?: number
  type?: TransactionType
  occurredAt?: Date
  categoryId?: string
}

export interface GetTransactionValidated {
  type?: TransactionType
  categoryId?: string
  from?: Date
  to?: Date
}
