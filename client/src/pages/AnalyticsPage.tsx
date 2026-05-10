import { useEffect, useState } from 'react'
import { getSummary } from '../api/summary'
import type { Summary } from '../types/summary'

export const AnalyticsPage = () => {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getSummary()
        setSummary(data)
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }
  if (summary === null) {
    return <p>Failed to load summary</p>
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
            <label>Type</label>

            <select>
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label>From</label>
            <input type="date" />
          </div>

          <div>
            <label>To</label>
            <input type="date" />
          </div>

          <button>Apply filters</button>
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

        <div>Chart placeholder</div>
      </section>
    </div>
  )
}
