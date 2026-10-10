import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PROTEGER_RUTAS, RUTAS } from './rutas'

/*
 * Envuelve las rutas que necesitan login.
 * Si no hay sesión, redirige a Login y recuerda a qué página quería ir el usuario
 * (queda en location.state.desde, para volver ahí después de iniciar sesión).
 * Si hay sesión, <Outlet /> muestra la ruta hija que corresponde.
 *
 * Convención con el Login (Persona 5): hay sesión si existe localStorage 'token'.
 */
export default function RutaProtegida() {
  const ubicacion = useLocation()
  const haySesion = localStorage.getItem('token') !== null

  if (PROTEGER_RUTAS && !haySesion) {
    return <Navigate to={RUTAS.LOGIN} replace state={{ desde: ubicacion.pathname }} />
  }

  return <Outlet />
}
