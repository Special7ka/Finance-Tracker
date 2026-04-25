import { useNavigate } from 'react-router-dom'
import { TransactionsForm } from '../features/transactions/TransactionsForm'
export const TransactionsPage = () => {
  const navigate = useNavigate()
  return (
    <>
      <TransactionsForm />
      <button
        onClick={() => {
          localStorage.clear()
          navigate('/')
        }}
      >
        Delete token
      </button>
    </>
  )
}
