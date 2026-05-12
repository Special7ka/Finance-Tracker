export interface Summary {
  expense: number
  income: number
  balance: number
}

export type GetSummaryFilters = {
  type?: string
  from?: string
  to?: string
}
