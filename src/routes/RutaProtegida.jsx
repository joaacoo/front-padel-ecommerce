import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PROTEGER_RUTAS, RUTAS } from './rutas'

/*
 * Envuelve las rutas que necesitan login.
 * Si no hay sesión, redirige a Login y recuerda a qué página quería ir el usuario
 * (queda en location.state.desde, para volver ahí después de iniciar sesión).
 * Si hay sesión, <Outlet /> muestra la ruta hija que corresponde.
 */
export default function RutaProtegida() {
  const ubicacion = useLocation()
  const estaAutenticado = useSelector((state) => state.auth.estaAutenticado)
  const sesionVerificada = useSelector((state) => state.auth.sesionVerificada)

  if (PROTEGER_RUTAS && !sesionVerificada) {
    return null
  }

  if (PROTEGER_RUTAS && !estaAutenticado) {
    return <Navigate to={RUTAS.LOGIN} replace state={{ desde: ubicacion.pathname }} />
  }

  return <Outlet />
}
