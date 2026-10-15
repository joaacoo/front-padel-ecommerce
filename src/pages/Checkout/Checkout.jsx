import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCarrito } from '../../context/CarritoContext'
import { crearPedido } from '../../services/pedidoService'
import { RUTAS } from '../../routes/rutas'
import { formatearFecha, formatearPrecio } from '../../utils/formato'
import Boton from '../../components/ui/Boton'
import { MensajeError, MensajeVacio } from '../../components/ui/Estado'
import './Checkout.css'

export default function Checkout() {
  const { usuario } = useAuth()
  const { items, total, vaciarCarrito } = useCarrito()
  const [pedido, setPedido] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const bloqueo = useRef(false)

  async function confirmar(event) {
    event.preventDefault()
    if (bloqueo.current) return
    bloqueo.current = true
    setEnviando(true)
    setError('')
    try {
      const creado = await crearPedido(usuario?.id, items)
      setPedido(creado)
      vaciarCarrito()
    } catch (error) {
      setError(error.message || 'No pudimos confirmar el pedido.')
    } finally {
      bloqueo.current = false
      setEnviando(false)
    }
  }

  if (pedido) return (
    <main className="compra contenedor">
      <section className="compra__confirmacion" aria-labelledby="confirmacion-titulo">
        <span className="compra__check" aria-hidden="true">✓</span>
        <h1 id="confirmacion-titulo" tabIndex={-1} ref={(nodo) => nodo?.focus()}>¡Pedido confirmado!</h1>
        <p>Gracias por tu compra. Tu pedido fue registrado.</p>
        <dl className="compra__datos">
          <div><dt>Número de pedido</dt><dd>#{pedido.id}</dd></div>
          <div><dt>Fecha</dt><dd>{formatearFecha(pedido.fecha)}</dd></div>
          <div><dt>Total</dt><dd>{formatearPrecio(pedido.total)}</dd></div>
        </dl>
        <p>No se realizó ningún cobro.</p>
        <div className="compra__acciones">
          <Link className="boton boton--primario" to={RUTAS.MIS_PEDIDOS}>Ver mis pedidos</Link>
          <Link className="boton boton--secundario" to={RUTAS.PRODUCTOS}>Seguir comprando</Link>
        </div>
      </section>
    </main>
  )

  return (
    <main className="compra contenedor">
      <h1>Confirmá tu pedido</h1>
      <p>Revisá los productos antes de confirmar. No se cobra nada en este paso.</p>
      {!items.length ? (
        <MensajeVacio titulo="Tu carrito está vacío">
          <p>Agregá productos para comenzar tu compra.</p>
          <Link to={RUTAS.PRODUCTOS}>Ver productos</Link>
        </MensajeVacio>
      ) : (
        <form onSubmit={confirmar} aria-busy={enviando}>
          <section className="compra__resumen" aria-label="Resumen del pedido">
            <div className="compra__fila compra__cabecera"><span>Producto</span><span>Subtotal</span></div>
            {items.map((item) => (
              <div className="compra__fila" key={item.productoId}>
                <div><strong>{item.productoNombre}</strong> × {item.cantidad}
                  <small>{formatearPrecio(item.precioUnitario)} por unidad</small>
                </div>
                <strong>{formatearPrecio(item.precioUnitario * item.cantidad)}</strong>
              </div>
            ))}
            <div className="compra__fila compra__total"><strong>Total estimado</strong><strong>{formatearPrecio(total)}</strong></div>
          </section>
          <p className="compra__aviso">Al confirmar validamos la disponibilidad. El total definitivo se muestra en la confirmación.</p>
          {usuario?.id ? <p>Pedido a nombre de <strong>{usuario.nombre}</strong> · {usuario.email}</p> : (
            <p role="status">Para confirmar tu compra, <Link to={RUTAS.LOGIN} state={{ desde: RUTAS.CHECKOUT }}>iniciá sesión</Link>. Tu carrito se conserva.</p>
          )}
          {error && <><MensajeError mensaje={error} /><p>Si hubo un problema de conexión, <Link to={RUTAS.MIS_PEDIDOS}>consultá tus pedidos</Link> antes de volver a confirmar.</p></>}
          <div className="compra__acciones">
            <Boton type="submit" disabled={enviando || !usuario?.id}>{enviando ? 'Confirmando…' : 'Confirmar pedido'}</Boton>
            {!enviando && <Link className="boton boton--secundario" to={RUTAS.CARRITO}>Editar carrito</Link>}
          </div>
          {enviando && <p role="status">Estamos registrando tu pedido. Esperá la confirmación.</p>}
        </form>
      )}
    </main>
  )
}
