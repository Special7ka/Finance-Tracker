import type { Summary } from '../../types/summary'

const SummaryCards = (props: { summary: Summary }) => {
  const { summary } = props

  return (
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
  )
}
export default SummaryCards
