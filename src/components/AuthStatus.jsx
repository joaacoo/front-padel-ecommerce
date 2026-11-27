import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AuthStatus() {
  const usuario = useSelector((state) => state.auth.usuario)
  const estaAutenticado = useSelector((state) => state.auth.estaAutenticado)

  if (!estaAutenticado) {
    return (
      <div className="auth-status">
        <Link to="/login">Iniciar sesión</Link>
        <Link to="/registro" className="btn btn-primary btn-small">Registrarse</Link>
      </div>
    )
  }

  return (
    <div className="auth-status">
      <Link to="/perfil" className="auth-status__perfil-link">
        Hola, {usuario.nombre}
      </Link>
    </div>
  )
}