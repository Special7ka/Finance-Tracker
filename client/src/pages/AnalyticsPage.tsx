import { useEffect, useState } from 'react'
import { getSummary, getSummaryByCategory } from '../api/summary'
import type { Summary, SummaryByCategoryItem } from '../types/summary'
import type { GetSummaryFilters } from '../types/summary'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import getErrorMessage from '../utils/getErrorMessage'

export const AnalyticsPage = () => {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [fromDateFilter, setFromDateFilter] = useState('')
  const [toDateFilter, setToDateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('EXPENSE')
  const [categoriesSummary, setCategoriesSummary] = useState<
    SummaryByCategoryItem[]
  >([])
  const [errorState, setErrorState] = useState<string | null>(null)

  const fetchSummary = async (filters?: GetSummaryFilters) => {
    const data = await getSummary(filters)
    setSummary(data)
  }

  const fetchCategoriesSummary = async (filters?: GetSummaryFilters) => {
    const data = await getSummaryByCategory(filters)
    setCategoriesSummary(data)
  }
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchSummary(),
          fetchCategoriesSummary({ type: 'EXPENSE' }),
        ])
      } catch (e) {
        setErrorState(getErrorMessage(e))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <LoadingState />
  }
  if (errorState) {
    return <ErrorState message={errorState} />
  }
  if (summary === null) {
    return <ErrorState message="Failed to load summary" />
  }

  return (
    <div>
      <header>
        <h1>Analytics</h1>
        <p>Track your income, expenses and financial activity</p>
      </header>

      <section>
        <h2>Filters</h2>

        <div>
          <div>
            <label>From</label>
            <input
              type="date"
              value={fromDateFilter}
              onChange={(e) => setFromDateFilter(e.target.value)}
            />
          </div>

          <div>
            <label>To</label>
            <input
              type="date"
              value={toDateFilter}
              onChange={(e) => setToDateFilter(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              fetchSummary({
                from: fromDateFilter || undefined,
                to: toDateFilter || undefined,
              })

              fetchCategoriesSummary({
                type: typeFilter as 'INCOME' | 'EXPENSE',
                from: fromDateFilter || undefined,
                to: toDateFilter || undefined,
              })
            }}
          >
            Apply filters
          </button>
        </div>
      </section>
      <section>
        <h2>Summary</h2>
        <div>
          <div>
            <h3>Total income</h3>
            <p>${summary.income.toFixed(2)}</p>
          </div>

          <div>
            <h3>Total expense</h3>
            <p>${summary.expense.toFixed(2)}</p>
          </div>

          <div>
            <h3>Balance</h3>
            <p>${summary.balance.toFixed(2)}</p>
          </div>
        </div>
      </section>
      <section>
        <h2>Spending by category</h2>
        <select
          onChange={(e) => {
            const type = e.target.value
            setTypeFilter(type)
            fetchCategoriesSummary({
              type: type === '' ? undefined : (type as 'INCOME' | 'EXPENSE'),
              from: fromDateFilter || undefined,
              to: toDateFilter || undefined,
            })
          }}
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
    </div>
  )
}
