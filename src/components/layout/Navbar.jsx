import { Link, useNavigate } from 'react-router-dom'
import { RUTAS } from '../../routes/rutas'
import { useAuth } from '../../context/AuthContext'
import AuthStatus from '../AuthStatus'
import './Navbar.css'

export default function Navbar() {
  const { usuario, estaAutenticado, logout } = useAuth()
  const navigate = useNavigate()
  const esAdmin = usuario?.rol === 'ADMIN'

  const manejarLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar__superior">
        <div className="contenedor navbar__fila">
          <AuthStatus />
          <nav className="navbar__acciones" aria-label="Mi cuenta">
            <Link to={RUTAS.MIS_PEDIDOS}>Mis pedidos</Link>
            {esAdmin && <Link to={RUTAS.MIS_PRODUCTOS}>Mis productos</Link>}
          </nav>
        </div>
      </div>

      <div className="navbar__principal">
        <div className="contenedor navbar__fila">
          <Link to={RUTAS.PRODUCTOS} className="navbar__logo">
            <span className="navbar__punto" aria-hidden="true"></span>
            Punto de Oro
          </Link>

          {/* Persona 2: buscador */}
          <div className="navbar__espacio"></div>

          <div className="navbar__botones-derecha">
            <Link to={RUTAS.CARRITO} className="navbar__carrito">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="navbar__carrito-icono"
                aria-hidden="true"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span>Mi Carrito</span>
            </Link>

            {estaAutenticado && (
              <button
                type="button"
                className="navbar__btn-logout"
                onClick={manejarLogout}
                title="Cerrar sesión"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
