import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

// Estructura común de las pantallas internas: encabezado, contenido de la ruta (<Outlet />) y pie.
export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
