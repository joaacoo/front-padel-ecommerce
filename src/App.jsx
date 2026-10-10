import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import RutaAdmin from './routes/RutaAdmin'
import RutaProtegida from './routes/RutaProtegida'
import { RUTAS } from './routes/rutas'
import MisProductos from './pages/admin/MisProductos/MisProductos'
import PublicarProducto from './pages/admin/PublicarProducto/PublicarProducto'
import Carrito from './pages/Carrito/Carrito'
import Checkout from './pages/Checkout/Checkout'
import Login from './pages/Login/Login'
import MisPedidos from './pages/MisPedidos/MisPedidos'
import NoEncontrada from './pages/NoEncontrada/NoEncontrada'
import Perfil from './pages/Perfil/Perfil'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import ProductList from './pages/ProductList/ProductList'
import Registro from './pages/Registro/Registro'

/*
 * Mapa de rutas de la app (ver docs/wireflow.md).
 *
 * Públicas      → Login, Registro (sin encabezado)
 * Con login     → todo lo que está dentro de <RutaProtegida />
 * Solo ADMIN    → lo que está dentro de <RutaAdmin />
 *
 * <Layout /> agrega el encabezado y el pie a todas las pantallas internas.
 */
export default function App() {
  return (
    <Routes>
      <Route path={RUTAS.LOGIN} element={<Login />} />
      <Route path={RUTAS.REGISTRO} element={<Registro />} />

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path={RUTAS.PRODUCTOS} element={<ProductList />} />
          <Route path={RUTAS.PRODUCTO} element={<ProductDetail />} />
          <Route path={RUTAS.CARRITO} element={<Carrito />} />
          <Route path={RUTAS.CHECKOUT} element={<Checkout />} />
          <Route path={RUTAS.MIS_PEDIDOS} element={<MisPedidos />} />
          <Route path={RUTAS.PERFIL} element={<Perfil />} />

          <Route element={<RutaAdmin />}>
            <Route path={RUTAS.MIS_PRODUCTOS} element={<MisProductos />} />
            <Route path={RUTAS.PUBLICAR_PRODUCTO} element={<PublicarProducto />} />
            <Route path={RUTAS.EDITAR_PRODUCTO} element={<PublicarProducto />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  )
}
