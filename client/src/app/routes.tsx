import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { TransactionsPage } from '../pages/TransactionsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { AnalyticsPage } from '../pages/AnalyticsPage'

export const AppRoutes = () => {
  const token = localStorage.getItem('token')
  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/transactions" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TransactionsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AnalyticsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
