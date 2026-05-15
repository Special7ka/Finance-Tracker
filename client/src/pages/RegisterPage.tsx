import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { registerApi } from '../api/auth'
import getErrorMessage from '../utils/getErrorMessage'

export const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/transactions" replace />
  }
  return (
    <>
      Register
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (password !== confirmPassword) {
            return
          }
          try {
            const data = await registerApi(email, password)
            localStorage.setItem('token', data.token)
            navigate('/transactions', { replace: true })
          } catch (e) {
            alert(getErrorMessage(e))
          }
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit"> Submit</button>
      </form>
    </>
  )
}
