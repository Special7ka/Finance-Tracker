export interface Summary {
  expense: number
  income: number
  balance: number
}

export type SummaryByCategoryItem = {
  categoryId: string | null
  name: string
  amount: number
  percentage: number
}

export type GetSummaryFilters = {
  type?: string
  from?: string
  to?: string
}
