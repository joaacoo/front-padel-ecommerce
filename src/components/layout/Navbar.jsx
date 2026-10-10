import { Link } from 'react-router-dom'
import { RUTAS } from '../../routes/rutas'
import AuthStatus from '../AuthStatus'
import './Navbar.css'

/*
 * Encabezado común a todas las pantallas con login (ver docs/diseño/mockups/).
 * Define el lugar de cada cosa; el contenido de algunas zonas lo agregan otras personas:
 *
 *  - Saludo con el nombre y "Cerrar sesión" → Persona 5: <AuthStatus />.
 *    Mostrar "Mis productos" solo si el rol es ADMIN también depende de la sesión.
 *  - Buscador y franja de categorías        → Persona 2 (búsqueda y filtros).
 *  - Cantidad de productos en el carrito     → Persona 3 (estado del carrito).
 */
export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__superior">
        <div className="contenedor navbar__fila">
          <AuthStatus />
          <nav className="navbar__acciones" aria-label="Mi cuenta">
            <Link to={RUTAS.PERFIL}>Mi perfil</Link>
            <Link to={RUTAS.MIS_PEDIDOS}>Mis pedidos</Link>
            <Link to={RUTAS.MIS_PRODUCTOS}>Mis productos</Link>
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

          <Link to={RUTAS.CARRITO} className="navbar__carrito">
            Carrito
          </Link>
        </div>
      </div>

      {/* Persona 2: franja de categorías (ver docs/diseño/mockups/03-home.png) */}
    </header>
  )
}
