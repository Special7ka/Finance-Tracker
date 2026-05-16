import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type Props = {
  children: ReactNode
}
export const AppLayout = ({ children }: Props) => {
  const navigate = useNavigate()
  return (
    <>
      <header>
        <Link to="/transactions">Transactions</Link>
        <button
          onClick={() => {
            localStorage.removeItem('token')
            navigate('/login')
          }}
        >
          Logout
        </button>
        <Link to="/analytics">Analytics</Link>
      </header>
      <main>{children}</main>
    </>
  )
}
