import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { obtenerPedidos } from '../../services/pedidoService'
import { formatearFecha, formatearPrecio } from '../../utils/formato'
import { RUTAS } from '../../routes/rutas'
import { Cargando, MensajeError, MensajeVacio } from '../../components/ui/Estado'
import Boton from '../../components/ui/Boton'
import '../Checkout/Checkout.css'

function ListaPedidos({ usuarioId }) {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  useEffect(() => {
    let activo = true
    obtenerPedidos(usuarioId)
      .then((datos) => { if (activo) setPedidos(datos) })
      .catch((error) => { if (activo) setError(error.message || 'No pudimos cargar tus pedidos.') })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [usuarioId, intento])

  if (cargando) return <Cargando texto="Cargando tus pedidos…" />
  if (error) return <><MensajeError mensaje={error} /><Boton onClick={() => { setError(''); setCargando(true); setIntento(intento + 1) }}>Reintentar</Boton></>
  if (!pedidos.length) return <MensajeVacio titulo="Todavía no tenés pedidos"><p>Cuando confirmes una compra, la vas a encontrar acá.</p><Link to={RUTAS.PRODUCTOS}>Ver productos</Link></MensajeVacio>
  return <div className="pedidos__lista">{pedidos.map((pedido) => (
    <article className="pedidos__tarjeta" key={pedido.id}>
      <h2>Pedido #{pedido.id}</h2>
      <dl className="compra__datos">
        <div><dt>Fecha</dt><dd><time dateTime={pedido.fecha}>{formatearFecha(pedido.fecha)}</time></dd></div>
        <div><dt>Total</dt><dd>{formatearPrecio(pedido.total)}</dd></div>
      </dl>
    </article>
  ))}</div>
}

export default function MisPedidos() {
  const { usuario } = useAuth()
  return <main className="compra contenedor">
    <h1>Mis pedidos</h1>
    <p>Consultá tus compras, desde la más reciente.</p>
    {usuario?.id ? <ListaPedidos key={usuario.id} usuarioId={usuario.id} /> : <p><Link to={RUTAS.LOGIN} state={{ desde: RUTAS.MIS_PEDIDOS }}>Iniciá sesión</Link> para ver tus pedidos.</p>}
  </main>
}
