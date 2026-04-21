import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import { TransactionsPage } from "../pages/Transactions";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const AppRoutes = () => {
    const token = localStorage.getItem("token")
  return (
    <Routes>
      <Route path = "/" element = {token ?   <Navigate to = "/transactions" replace/> : <Navigate to ="/login" replace/>  }/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/transactions" element={<ProtectedRoute> <TransactionsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}