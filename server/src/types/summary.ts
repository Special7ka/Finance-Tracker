import { TransactionType } from '@prisma/client'

export interface GetSummaryValidated {
  from?: Date
  to?: Date
  type?: TransactionType
}

export interface SummaryByCategoryItem {
  categoryId: string | null
  amount: number
  name: string
  percentage: number
}
