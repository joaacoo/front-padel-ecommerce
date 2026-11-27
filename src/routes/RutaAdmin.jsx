import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PROTEGER_RUTAS, RUTAS } from './rutas'

/*
 * Envuelve las rutas del rol ADMIN. Va siempre dentro de RutaProtegida
 * (o sea, el usuario ya está logueado cuando llega acá).
 *
 * Importante: esto solo esconde pantallas. La seguridad real la hace el backend,
 * que responde 403 si un usuario sin rol ADMIN intenta crear o borrar un producto.
 */
export default function RutaAdmin() {
  const rol = useSelector((state) => state.auth.usuario?.rol)
  const esAdmin = rol === 'ADMIN'

  if (PROTEGER_RUTAS && !esAdmin) {
    return <Navigate to={RUTAS.PRODUCTOS} replace />
  }

  return <Outlet />
}
