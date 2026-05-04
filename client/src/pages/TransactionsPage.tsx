import { useNavigate } from 'react-router-dom'
import { TransactionsForm } from '../features/transactions/TransactionsForm'
import { api } from '../api/client'
import { useEffect, useState } from 'react'
import type { Transaction } from '../types/transactions'

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const onTransactionCreated = async () => {
    const response = await api.get('/transactions')
    setTransactions(response.data.transactions)
  }

  useEffect(() => {
    onTransactionCreated()
  }, [])

  const navigate = useNavigate()
  return (
    <>
      <TransactionsForm onTransactionCreated={onTransactionCreated} />
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
