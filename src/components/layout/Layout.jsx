import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { obtenerCarritoThunk } from '../../store/slices/carritoSlice'
import Footer from './Footer'
import Navbar from './Navbar'

// Estructura común de las pantallas internas: encabezado, contenido de la ruta (<Outlet />) y pie.
export default function Layout() {
  const dispatch = useDispatch()
  const usuario = useSelector((state) => state.auth.usuario)
  const estaAutenticado = useSelector((state) => state.auth.estaAutenticado)

  useEffect(() => {
    if (estaAutenticado && usuario?.id) {
      dispatch(obtenerCarritoThunk(usuario.id))
    }
  }, [dispatch, estaAutenticado, usuario?.id])

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
