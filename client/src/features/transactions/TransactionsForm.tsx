import { useEffect, useState } from 'react'
import { api } from '../../api/client'

type Category = {
  id: string
  name: string
}
type Props = {
  onTransactionCreated: () => Promise<void>
}

export const TransactionsForm = ({ onTransactionCreated }: Props) => {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [occurredAt, setOccurredAt] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories')
        setCategories(res.data)
      } catch (e) {
        console.log(e)
      }
    }

    fetchCategories()
  }, [])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()

        try {
          if (!amount || !type || !occurredAt) {
            alert('Fill required fields')
            return
          }

          await api.post('/transactions', {
            amount: Number(amount),
            type,
            categoryId: categoryId || null,
            occurredAt,
          })
          onTransactionCreated()
          setAmount('')
          setCategoryId('')
          setOccurredAt('')

          alert('Transaction created')
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
        <option value="">Select category</option>

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
