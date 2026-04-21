import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

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
        onSubmit={(e) => {
          e.preventDefault()
          if (password !== confirmPassword) {
            console.log('Pass dont match')
            return
          }
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
