
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerProductoPorId } from '../../services/productoService'
import { RUTAS } from '../../routes/rutas'
import { formatearPrecio } from '../../utils/formato'
import Boton from '../../components/ui/Boton'
import './ProductDetail.css'
import { useCarrito } from '../../context/CarritoContext'

export default function ProductDetail() {
  const { id } = useParams()
   
  const { agregarProducto } = useCarrito()
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let activo = true

    setCargando(true)
    setError(null)
    setProducto(null)
    setCantidad(1)
    setMensaje('')

    obtenerProductoPorId(id)
      .then((datos) => {
        if (activo) setProducto(datos)
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [id])

  if (cargando) {
    return (
      <main className="detalle contenedor">
        <p>Cargando producto...</p>
      </main>
    )
  }

  if (error || !producto) {
    return (
      <main className="detalle contenedor">
        <h1>Producto no encontrado</h1>
        <p>{error}</p>
        <Link to={RUTAS.PRODUCTOS}>Volver al catálogo</Link>
      </main>
    )
  }

  const sinStock = producto.stock <= 0

  const aumentarCantidad = () => {
    setCantidad((actual) =>
      Math.min(actual + 1, producto.stock)
    )
  }

  const disminuirCantidad = () => {
    setCantidad((actual) =>
      Math.max(actual - 1, 1)
    )
  }

  const agregarAlCarrito = () => {
    const agregado = agregarProducto(producto, cantidad)

    if (agregado) {
      setMensaje(
        `Agregaste ${cantidad} unidad(es) de ${producto.nombre} al carrito.`
      )
    } else {
      setMensaje('No hay stock suficiente para agregar esa cantidad.')
    }
  }

  return (
    <main className="detalle contenedor">

      <nav className="detalle__breadcrumb">
        <Link to={RUTAS.PRODUCTOS}>Inicio</Link>
        <span>›</span>
        <span>{producto.categoria}</span>
        <span>›</span>
        <strong>{producto.nombre}</strong>
      </nav>

      <section className="detalle__contenido">

        <div className="detalle__galeria">
          <div className="detalle__imagen-principal">
            {producto.imagenUrl ? (
              <img
                src={producto.imagenUrl}
                alt={producto.nombre}
              />
            ) : (
              <span>Sin imagen disponible</span>
            )}
          </div>

          <div className="detalle__miniaturas">
            <div className="detalle__miniatura detalle__miniatura--activa">
              {producto.imagenUrl && (
                <img
                  src={producto.imagenUrl}
                  alt={`Vista de ${producto.nombre}`}
                />
              )}
            </div>
          </div>
        </div>

        <div className="detalle__informacion">

          <span className="detalle__categoria">
            {producto.categoria}
          </span>

          <h1 className="detalle__titulo">
            {producto.nombre}
          </h1>

          <div className="detalle__precio-stock">
            <span className="detalle__precio">
              {formatearPrecio(producto.precio)}
            </span>

            <span className={
              sinStock
                ? 'detalle__stock detalle__stock--agotado'
                : 'detalle__stock detalle__stock--disponible'
            }>
              {sinStock
                ? 'SIN STOCK'
                : `${producto.stock} DISPONIBLES`}
            </span>
          </div>

          <p className="detalle__descripcion">
            {producto.descripcion}
          </p>

          {sinStock && (
            <div className="detalle__alerta">
              Este producto no tiene unidades disponibles.
              No se puede agregar al carrito hasta que
              se reponga el stock.
            </div>
          )}

          <div className="detalle__compra">

            <label>Cantidad</label>

            <div className="detalle__acciones">

              <div className="detalle__contador">
                <button
                  type="button"
                  onClick={disminuirCantidad}
                  disabled={sinStock || cantidad <= 1}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>

                <span>{sinStock ? 0 : cantidad}</span>

                <button
                  type="button"
                  onClick={aumentarCantidad}
                  disabled={sinStock || cantidad >= producto.stock}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              <Boton
                variante="primario"
                onClick={agregarAlCarrito}
                disabled={sinStock}
                className="detalle__boton-carrito"
              >
                {sinStock
                  ? 'SIN STOCK'
                  : 'AGREGAR AL CARRITO'}
              </Boton>

            </div>

            {!sinStock && (
              <p className="detalle__limite">
                Máximo {producto.stock} unidades:
                el stock disponible.
              </p>
            )}

            {mensaje && (
              <p className="detalle__mensaje" role="status">
                {mensaje}
              </p>
            )}

            {sinStock && (
              <Link
                to={RUTAS.PRODUCTOS}
                className="detalle__volver"
              >
                Ver otros productos
              </Link>
            )}

          </div>
        </div>
      </section>
    </main>
  )
}
