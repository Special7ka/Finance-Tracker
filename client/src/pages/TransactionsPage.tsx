import { TransactionsForm } from '../features/transactions/TransactionsForm'
import { useEffect, useState } from 'react'
import type { Transaction, TransactionTypeFilter } from '../types/transactions'
import type { Category } from '../types/categories'
import type { GetTransactionsFilters } from '../types/transactions'
import LoadingState from '../components/states/LoadingState'
import ErrorState from '../components/states/ErrorState'
import { getTransactions, deleteTransaction } from '../api/transactions'
import { getCategories } from '../api/categories'
import getErrorMessage from '../utils/getErrorMessage'
import TransactionsFilters from '../features/transactions/TransactionsFilters'
import TransactionsList from '../features/transactions/TransactionsList'

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [fromDateFilter, setFromDateFilter] = useState('')
  const [toDateFilter, setToDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorState, setErrorState] = useState<string | null>(null)

  const onTransactionsChanged = async (filters?: GetTransactionsFilters) => {
    const response = await getTransactions(filters)
    setTransactions(response)
  }

  const onEditFinished = () => {
    setEditingTransaction(null)
  }

  const handleDelete = async (transaction: Transaction) => {
    await deleteTransaction(transaction.id)
    await onTransactionsChanged({
      type: typeFilter,
      categoryId: categoryFilter,
      from: fromDateFilter,
      to: toDateFilter,
    })
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fetchCategories = async () => {
    const res = await getCategories()
    setCategories(res)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchCategories(), onTransactionsChanged()])
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

  return (
    <>
      <TransactionsForm
        onTransactionsChanged={onTransactionsChanged}
        editingTransaction={editingTransaction}
        onEditFinished={onEditFinished}
        categories={categories}
      />

      <TransactionsFilters
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        fromDateFilter={fromDateFilter}
        setFromDateFilter={setFromDateFilter}
        toDateFilter={toDateFilter}
        setToDateFilter={setToDateFilter}
        categories={categories}
        onTransactionsChanged={onTransactionsChanged}
      />

      <TransactionsList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  )
}
