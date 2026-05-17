import type { Transaction } from '../../types/transactions'
import EmptyState from '../../components/states/EmptyState'

type TransactionListProps = {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

const TransactionsList = (props: TransactionListProps) => {
  const { transactions, onEdit, onDelete } = props

  return (
    <div>
      {transactions.length === 0 ? (
        <EmptyState message="No transactions found for selected filters" />
      ) : (
        transactions.map((transaction) => {
          return (
            <div key={transaction.id}>
              <span>{transaction.type}</span>-<span>{transaction.amount}</span>-
              <span>
                {new Date(transaction.occurredAt).toLocaleDateString()}
              </span>
              -<span>{transaction.category?.name ?? 'No category'}</span> -
              <button
                onClick={() => {
                  onEdit(transaction)
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(transaction)
                }}
              >
                Delete
              </button>
            </div>
          )
        })
      )}
    </div>
  )
}

export default TransactionsList
