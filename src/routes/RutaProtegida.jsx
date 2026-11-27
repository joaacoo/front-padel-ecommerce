import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PROTEGER_RUTAS, RUTAS } from './rutas'

/*
 * Envuelve las rutas que necesitan login.
 * Si la sesión todavía no fue verificada, espera antes de decidir.
 * Si no hay sesión, redirige a Login.
 * Si hay sesión, <Outlet /> muestra la ruta hija que corresponde.
 */
export default function RutaProtegida() {
  const estaAutenticado = useSelector((state) => state.auth.estaAutenticado)
  const sesionVerificada = useSelector((state) => state.auth.sesionVerificada)

  if (PROTEGER_RUTAS && !sesionVerificada) {
    return null
  }

  if (PROTEGER_RUTAS && !estaAutenticado) {
    return <Navigate to={RUTAS.LOGIN} replace />
  }

  return <Outlet />
}
