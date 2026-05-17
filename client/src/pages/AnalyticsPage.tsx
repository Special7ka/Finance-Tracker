import { useEffect, useState } from 'react'
import { getSummary, getSummaryByCategory } from '../api/summary'
import type { Summary, SummaryByCategoryItem } from '../types/summary'
import type { GetSummaryFilters } from '../types/summary'
import LoadingState from '../components/states/LoadingState'
import ErrorState from '../components/states/ErrorState'
import getErrorMessage from '../utils/getErrorMessage'
import AnalyticsFilters from '../features/analytics/AnalyticsFilters'
import SummaryCards from '../features/analytics/SummaryCards'
import CategorySummaryList from '../features/analytics/CategorySummaryList'
import type { TransactionType } from '../types/transactions'

export const AnalyticsPage = () => {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [fromDateFilter, setFromDateFilter] = useState('')
  const [toDateFilter, setToDateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('EXPENSE')
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

  const handleApplyFilters = () => {
    fetchSummary({
      from: fromDateFilter || undefined,
      to: toDateFilter || undefined,
    })

    fetchCategoriesSummary({
      type: typeFilter === '' ? undefined : typeFilter,
      from: fromDateFilter || undefined,
      to: toDateFilter || undefined,
    })
  }

  const handleTypeFilterChange = (type: TransactionType | '') => {
    setTypeFilter(type)
    fetchCategoriesSummary({
      type: type === '' ? undefined : type,
      from: fromDateFilter || undefined,
      to: toDateFilter || undefined,
    })
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

      <AnalyticsFilters
        fromDateFilter={fromDateFilter}
        setFromDateFilter={setFromDateFilter}
        toDateFilter={toDateFilter}
        setToDateFilter={setToDateFilter}
        onApplyFilters={handleApplyFilters}
      />

      <SummaryCards summary={summary} />

      <CategorySummaryList
        categoriesSummary={categoriesSummary}
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeFilterChange}
      />
    </div>
  )
}
