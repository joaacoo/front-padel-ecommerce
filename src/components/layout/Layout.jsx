import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth } from '../../context/AuthContext'
import { obtenerCarritoThunk } from '../../store/slices/carritoSlice'
import Footer from './Footer'
import Navbar from './Navbar'

// Estructura común de las pantallas internas: encabezado, contenido de la ruta (<Outlet />) y pie.
export default function Layout() {
  const dispatch = useDispatch()
  const { usuario } = useAuth()

  useEffect(() => {
    if (usuario?.id) {
      dispatch(obtenerCarritoThunk(usuario.id))
    }
  }, [dispatch, usuario?.id])

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
