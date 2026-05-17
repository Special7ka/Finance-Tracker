import type { TransactionTypeFilter } from '../../types/transactions'
import type { Category } from '../../types/categories'
import type { GetTransactionsFilters } from '../../types/transactions'

type TransactionsFiltersProps = {
  typeFilter: TransactionTypeFilter
  setTypeFilter: (value: TransactionTypeFilter) => void
  categoryFilter: string
  setCategoryFilter: (value: string) => void
  fromDateFilter: string
  setFromDateFilter: (value: string) => void
  toDateFilter: string
  setToDateFilter: (value: string) => void
  categories: Category[]
  onTransactionsChanged: (filters: GetTransactionsFilters) => void
}

const TransactionsFilters = (props: TransactionsFiltersProps) => {
  const {
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    fromDateFilter,
    setFromDateFilter,
    toDateFilter,
    setToDateFilter,
    categories,
    onTransactionsChanged,
  } = props

  return (
    <div>
      <h2>Filters</h2>
      <b />
      <select
        value={typeFilter}
        onChange={(e) => {
          setTypeFilter(e.target.value as TransactionTypeFilter)
        }}
      >
        <option value="">All</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
      </select>
      <select
        value={categoryFilter}
        onChange={(e) => {
          setCategoryFilter(e.target.value)
        }}
      >
        <option value="">All categories</option>
        {categories.map((category) => {
          return (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          )
        })}
      </select>
      <input
        type="date"
        value={fromDateFilter}
        onChange={(e) => {
          setFromDateFilter(e.target.value)
        }}
      />
      <input
        type="date"
        value={toDateFilter}
        onChange={(e) => {
          setToDateFilter(e.target.value)
        }}
      />
      <button
        onClick={() => {
          onTransactionsChanged({
            type: typeFilter || undefined,
            categoryId: categoryFilter || undefined,
            from: fromDateFilter || undefined,
            to: toDateFilter || undefined,
          })
        }}
      >
        Apply filters
      </button>
    </div>
  )
}

export default TransactionsFilters
