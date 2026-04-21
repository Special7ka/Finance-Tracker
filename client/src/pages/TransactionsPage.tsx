import { useNavigate } from 'react-router-dom'
export const TransactionsPage = () => {
  const navigate = useNavigate()
  return (
    <>
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
