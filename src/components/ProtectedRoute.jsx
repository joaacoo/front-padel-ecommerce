import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
  const estaAutenticado = useSelector((state) => state.auth.estaAutenticado)
  const sesionVerificada = useSelector((state) => state.auth.sesionVerificada)
  const location = useLocation()
  if (!sesionVerificada) return null
  if (!estaAutenticado) return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  return children
}