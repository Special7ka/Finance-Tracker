import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { loginApi } from '../api/client'

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
        onSubmit={async (e) => {
          e.preventDefault()
          try {
            const data = await loginApi(email, password)
            localStorage.setItem('token', data.token)
            navigate('/transactions', { replace: true })
          } catch (e) {}
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
