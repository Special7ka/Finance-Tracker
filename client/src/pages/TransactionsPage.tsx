import { useNavigate } from 'react-router-dom'
import { TransactionsForm } from '../features/transactions/TransactionsForm'
import { api } from '../api/client'
import { useEffect, useState } from 'react'
import type { Transaction, TransactionTypeFilter } from '../types/transactions'
import type { Category } from '../types/categories'

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [fromDateFilter, setFromDateFilter] = useState('')
  const [toDateFilter, setToDateFilter] = useState('')

  const onTransactionsChanged = async (
    typeFilter?: TransactionTypeFilter,
    categoryFilter?: string,
    fromDate?: string,
    toDate?: string,
  ) => {
    const response = await api.get('/transactions', {
      params: {
        type: typeFilter || undefined,
        categoryId: categoryFilter || undefined,
        from: fromDate || undefined,
        to: toDate || undefined,
      },
    })
    setTransactions(response.data.transactions)
  }

  const onEditFinished = () => {
    setEditingTransaction(null)
  }

  const handleDelete = async (transaction: Transaction) => {
    await api.delete('/transactions/' + transaction.id)
    await onTransactionsChanged(
      typeFilter,
      categoryFilter,
      fromDateFilter,
      toDateFilter,
    )
  }

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    onTransactionsChanged()

    fetchCategories()
  }, [])

  const navigate = useNavigate()
  return (
    <>
      <TransactionsForm
        onTransactionsChanged={onTransactionsChanged}
        editingTransaction={editingTransaction}
        onEditFinished={onEditFinished}
        categories={categories}
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
          onTransactionsChanged(
            typeFilter,
            categoryFilter,
            fromDateFilter,
            toDateFilter,
          )
        }}
      >
        Apply filters
      </button>
      <div>
        {transactions.map((transaction) => {
          return (
            <div key={transaction.id}>
              <span>{transaction.type}</span>-<span>{transaction.amount}</span>-
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
