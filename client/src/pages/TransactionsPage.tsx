import { useNavigate } from 'react-router-dom'
import { TransactionsForm } from '../features/transactions/TransactionsForm'
import { api } from '../api/client'
import { useEffect, useState } from 'react'
import type { Transaction, TransactionTypeFilter } from '../types/transactions'

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('')

  const onTransactionsChanged = async () => {
    const response = await api.get('/transactions')
    setTransactions(response.data.transactions)
  }

  const onEditFinished = () => {
    setEditingTransaction(null)
  }

  const handleDelete = async (transaction: Transaction) => {
    await api.delete('/transactions/' + transaction.id)
    await onTransactionsChanged()
  }

  useEffect(() => {
    onTransactionsChanged()
  }, [])

  const navigate = useNavigate()
  return (
    <>
      <TransactionsForm
        onTransactionsChanged={onTransactionsChanged}
        editingTransaction={editingTransaction}
        onEditFinished={onEditFinished}
      />
      <button
        onClick={() => {
          localStorage.removeItem('token')
          navigate('/')
        }}
      >
        Delete token
      </button>
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
      <div>
        {transactions
          .filter(
            (transaction) => !typeFilter || transaction.type === typeFilter,
          )
          .map((transaction) => {
            return (
              <div key={transaction.id}>
                <span>{transaction.type}</span>-
                <span>{transaction.amount}</span>-
                <span>
                  {new Date(transaction.occurredAt).toLocaleDateString()}
                </span>
                -<span>{transaction.category?.name ?? 'No category'}</span> -
                <button
                  onClick={() => {
                    setEditingTransaction(transaction)
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(transaction)
                  }}
                >
                  Delete
                </button>
              </div>
            )
          })}
      </div>
    </>
  )
}
