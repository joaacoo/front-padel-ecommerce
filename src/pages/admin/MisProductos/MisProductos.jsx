import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Boton from '../../../components/ui/Boton'
import { Cargando, MensajeError, MensajeVacio } from '../../../components/ui/Estado'
import { RUTAS, rutaEditarProducto } from '../../../routes/rutas'
import { eliminarProducto, obtenerMisProductos } from '../../../services/productoService'
import { formatearPrecio } from '../../../utils/formato'
import './MisProductos.css'

export default function MisProductos() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [errorEliminar, setErrorEliminar] = useState(null)
  const [eliminandoId, setEliminandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let montado = true
    obtenerMisProductos()
      .then((datos) => { if (montado) setProductos(datos) })
      .catch((err) => {
        if (montado) setError(err.message || 'No se pudieron cargar tus productos.')
      })
      .finally(() => { if (montado) setCargando(false) })
    return () => { montado = false }
  }, [intento])

  const reintentar = () => {
    setError(null)
    setCargando(true)
    setIntento((actual) => actual + 1)
  }

  const manejarEliminar = async (producto) => {
    if (eliminandoId !== null) return
    if (!window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return
    setEliminandoId(producto.id)
    setErrorEliminar(null)
    setMensaje('')
    try {
      await eliminarProducto(producto.id)
      setProductos((actuales) => actuales.filter((actual) => actual.id !== producto.id))
      setMensaje(`Se eliminó "${producto.nombre}".`)
    } catch (err) {
      setErrorEliminar(err.message || 'No se pudo eliminar el producto. Intentá nuevamente.')
    } finally {
      setEliminandoId(null)
    }
  }

  const sinStock = productos.filter((producto) => producto.stock <= 0).length

  return (
    <section className="mis-productos contenedor" aria-labelledby="mis-productos-titulo">
      <header className="mis-productos__encabezado">
        <div>
          <span className="mis-productos__etiqueta">Admin</span>
          <h1 id="mis-productos-titulo">Mis productos</h1>
          {!cargando && !error && (
            <p className="mis-productos__resumen">
              {productos.length} {productos.length === 1 ? 'publicado' : 'publicados'} · {sinStock} sin stock
            </p>
          )}
        </div>
        <Link className="boton boton--primario mis-productos__publicar" to={RUTAS.PUBLICAR_PRODUCTO}>
          + Publicar producto
        </Link>
      </header>
      {cargando && <Cargando texto="Cargando tus productos…" />}
      {error && (
        <div>
          <MensajeError mensaje={error} />
          <Boton variante="secundario" onClick={reintentar}>Reintentar</Boton>
        </div>
      )}
      {errorEliminar && <MensajeError mensaje={errorEliminar} />}
      <p className="mis-productos__confirmacion" role="status">{mensaje}</p>
      {!cargando && !error && (productos.length === 0 ? (
        <MensajeVacio titulo="Todavía no publicaste productos">
          <p>Publicá tu primer producto para empezar a administrar tu catálogo.</p>
        </MensajeVacio>
      ) : (
        <div className="mis-productos__tabla-contenedor" role="region" aria-label="Tus productos" tabIndex={0}>
          <table className="mis-productos__tabla">
            <caption className="solo-lectores">Productos publicados por vos y acciones de administración</caption>
            <thead>
              <tr>
                <th scope="col">Producto</th><th scope="col">Categoría</th>
                <th scope="col">Precio</th><th scope="col">Stock disponible</th><th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} aria-busy={eliminandoId === producto.id}>
                  <th scope="row">
                    <div className="mis-productos__producto">
                      <div className="mis-productos__imagen">
                        {producto.imagenUrl ? (
                          <img src={producto.imagenUrl} alt={producto.nombre} loading="lazy" />
                        ) : <span>Sin imagen</span>}
                      </div>
                      <span>{producto.nombre}</span>
                    </div>
                  </th>
                  <td>{producto.categoria}</td>
                  <td className="mis-productos__precio">{formatearPrecio(producto.precio)}</td>
                  <td>{producto.stock <= 0 ? <span className="mis-productos__sin-stock">Sin stock</span> : producto.stock}</td>
                  <td>
                    <div className="mis-productos__acciones">
                      <Boton variante="secundario" disabled={eliminandoId !== null}
                        aria-label={`Editar ${producto.nombre}`}
                        onClick={() => navigate(rutaEditarProducto(producto.id))}>
                        Editar
                      </Boton>
                      <Boton variante="peligro" disabled={eliminandoId !== null}
                        aria-label={`Eliminar ${producto.nombre}`}
                        onClick={() => manejarEliminar(producto)}>
                        {eliminandoId === producto.id ? 'Eliminando…' : 'Eliminar'}
                      </Boton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  )
}
