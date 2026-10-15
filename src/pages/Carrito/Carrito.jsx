
import { Link } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext'
import { RUTAS, rutaProducto } from '../../routes/rutas'
import { formatearPrecio } from '../../utils/formato'
import Boton from '../../components/ui/Boton'
import './Carrito.css'

export default function Carrito() {
  const {
    items,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    cantidadTotal,
    total
  } = useCarrito()

  return (
    <main className="carrito contenedor">
      <header className="carrito__encabezado">
        <h1>Tu carrito</h1>
        <span>
          {cantidadTotal} {cantidadTotal === 1 ? 'unidad' : 'unidades'}
        </span>
      </header>

      {items.length === 0 ? (
        <section className="carrito__vacio">
          <h2>Tu carrito está vacío</h2>
          <p>Todavía no agregaste productos a tu carrito.</p>

          <Link to={RUTAS.PRODUCTOS} className="carrito__enlace">
            Ver productos
          </Link>
        </section>
      ) : (
        <div className="carrito__contenido">
          <section className="carrito__productos" aria-label="Productos del carrito">
            {items.map((item) => (
              <article className="carrito__producto" key={item.productoId}>
                <Link
                  to={rutaProducto(item.productoId)}
                  className="carrito__imagen"
                >
                  {item.imagenUrl ? (
                    <img src={item.imagenUrl} alt={item.productoNombre} />
                  ) : (
                    <span>Sin imagen</span>
                  )}
                </Link>

                <div className="carrito__info">
                  <Link
                    to={rutaProducto(item.productoId)}
                    className="carrito__nombre"
                  >
                    {item.productoNombre}
                  </Link>

                  <span className="carrito__precio-unitario">
                    {formatearPrecio(item.precioUnitario)} c/u
                  </span>
                </div>

                <div className="carrito__contador">
                  <button
                    type="button"
                    onClick={() =>
                      actualizarCantidad(item.productoId, item.cantidad - 1)
                    }
                    disabled={item.cantidad <= 1}
                    aria-label={`Disminuir cantidad de ${item.productoNombre}`}
                  >
                    −
                  </button>

                  <span>{item.cantidad}</span>

                  <button
                    type="button"
                    onClick={() =>
                      actualizarCantidad(item.productoId, item.cantidad + 1)
                    }
                    disabled={item.cantidad >= item.stock}
                    aria-label={`Aumentar cantidad de ${item.productoNombre}`}
                  >
                    +
                  </button>
                </div>

                <strong className="carrito__subtotal">
                  {formatearPrecio(item.precioUnitario * item.cantidad)}
                </strong>

                <button
                  type="button"
                  className="carrito__eliminar"
                  onClick={() => eliminarProducto(item.productoId)}
                >
                  Eliminar
                </button>
              </article>
            ))}

            <Boton
              variante="secundario"
              onClick={vaciarCarrito}
              className="carrito__vaciar"
            >
              VACIAR CARRITO
            </Boton>
          </section>

          <aside className="carrito__resumen">
            <h2>Resumen</h2>

            <div className="carrito__resumen-fila">
              <span>Productos ({cantidadTotal})</span>
              <span>{formatearPrecio(total)}</span>
            </div>

            <div className="carrito__resumen-total">
              <strong>Total</strong>
              <strong>{formatearPrecio(total)}</strong>
            </div>

            <Link to={RUTAS.CHECKOUT} className="carrito__checkout">
              IR AL CHECKOUT
            </Link>

            <Link to={RUTAS.PRODUCTOS} className="carrito__seguir">
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </main>
  )
}

