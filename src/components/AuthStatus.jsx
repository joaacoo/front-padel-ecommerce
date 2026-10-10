import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthStatus() {
  const { usuario, estaAutenticado, logout } = useAuth()
  const navigate = useNavigate()

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
      <Link to="/perfil">Hola, {usuario.nombre}</Link>
      <button
        type="button"
        className="btn btn-small"
        onClick={() => { logout(); navigate('/') }}
      >
        Cerrar sesión
      </button>
    </div>
  )
}