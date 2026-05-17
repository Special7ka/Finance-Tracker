import type { SummaryByCategoryItem } from '../../types/summary'
import type { TransactionType } from '../../types/transactions'

import EmptyState from '../../components/states/EmptyState'

type CategorySummaryListProps = {
  categoriesSummary: SummaryByCategoryItem[]
  typeFilter: TransactionType | ''
  onTypeFilterChange: (type: TransactionType | '') => void
}

const CategorySummaryList = (props: CategorySummaryListProps) => {
  const { categoriesSummary, typeFilter, onTypeFilterChange } = props

  return (
    <section>
      <h2>Spending by category</h2>
      <select
        onChange={(e) =>
          onTypeFilterChange(e.target.value as TransactionType | '')
        }
        value={typeFilter}
      >
        <option value="">All</option>
        <option value="EXPENSE">Expense</option>
        <option value="INCOME">Income</option>
      </select>
      {categoriesSummary.length === 0 ? (
        <EmptyState message="No data for selected filters" />
      ) : (
        <ul>
          {categoriesSummary.map((item) => (
            <li key={item.categoryId ?? item.name}>
              {item.name}: ${item.amount.toFixed(2)} (
              {item.percentage.toFixed(2)}%)
            </li>
          ))}
        </ul>
      )}

      <div>Chart placeholder</div>
    </section>
  )
}
export default CategorySummaryList
