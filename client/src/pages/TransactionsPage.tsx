import { useNavigate } from 'react-router-dom'
import { TransactionsForm } from '../features/transactions/TransactionsForm'
import { api } from '../api/client'
import { useEffect, useState } from 'react'
import type { Transaction } from '../types/transactions'

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    async function fetchData() {
      const response = await api.get('/transactions')
      setTransactions(response.data.transactions)
    }

    fetchData()
  }, [])

  const navigate = useNavigate()
  return (
    <>
      <TransactionsForm />
      <button
        onClick={() => {
          localStorage.removeItem('token')
          navigate('/')
        }}
      >
        Delete token
      </button>
      <div>
        {transactions.map((transaction) => {
          return (
            <div key={transaction.id}>
              <span>{transaction.type}</span>-<span>{transaction.amount}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
