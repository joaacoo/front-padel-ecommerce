import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { estaAutenticado } = useAuth()
  const location = useLocation()
  if (!estaAutenticado) return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  return children
}