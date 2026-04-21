import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/transactions" replace />
  }
  return (
    <>
      Login
      <form
        onSubmit={(e) => {
          e.preventDefault()
          localStorage.setItem('token', 'some-token-code')
          navigate('/transactions', { replace: true })
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{' '}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit"> Submit</button>
      </form>
    </>
  )
}
