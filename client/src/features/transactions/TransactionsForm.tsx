import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import type { Category } from '../../types/categories'
import type { Transaction } from '../../types/transactions'
type Props = {
  onTransactionsChanged: () => Promise<void>
  editingTransaction?: Transaction | null
  onEditFinished: () => void
  categories: Category[]
}

export const TransactionsForm = ({
  onTransactionsChanged,
  editingTransaction,
  onEditFinished,
  categories,
}: Props) => {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [occurredAt, setOccurredAt] = useState('')

  useEffect(() => {
    if (!editingTransaction) {
      return
    }

    setAmount(editingTransaction.amount.toString())
    setType(editingTransaction.type)
    setOccurredAt(editingTransaction.occurredAt.slice(0, 10))
    if (editingTransaction.categoryId) {
      setCategoryId(editingTransaction.categoryId)
    } else {
      setCategoryId('')
    }
  }, [editingTransaction])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()

        try {
          if (!amount || !type || !occurredAt) {
            alert('Fill required fields')
            return
          }
          if (editingTransaction) {
            await api.patch('/transactions/' + editingTransaction.id, {
              amount: Number(amount),
              type,
              categoryId,
              occurredAt,
            })
            onEditFinished()
            alert('Transaction updated')
          } else {
            await api.post('/transactions', {
              amount: Number(amount),
              type,
              categoryId,
              occurredAt,
            })
            alert('Transaction created')
          }
          await onTransactionsChanged()
          setAmount('')
          setCategoryId('')
          setOccurredAt('')
          setType('')
        } catch (e) {
          console.log(e)
        }
      }}
    >
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select type of transaction</option>
        <option value="EXPENSE">Expense</option>
        <option value="INCOME">Income</option>
      </select>

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Select </option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="date"
        value={occurredAt}
        onChange={(e) => setOccurredAt(e.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  )
}
