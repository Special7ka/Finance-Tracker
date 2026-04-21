import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import { TransactionsPage } from "../pages/Transactions";
import { NotFoundPage } from "../pages/NotFoundPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path = "/" element = {<Navigate to = "/login" />}></Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  )
}