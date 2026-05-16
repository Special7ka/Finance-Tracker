import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

type props = {
  children: ReactNode
}
export const ProtectedRoute = ({ children }: props) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" />
  }
  return children
}
