import { Link } from 'react-router-dom'
import { rutaProducto } from '../../routes/rutas'
import { formatearPrecio } from '../../utils/formato'
import Boton from '../ui/Boton'
import './ProductCard.css'

export default function ProductCard({ producto, onAgregarAlCarrito }) {
  const { id, nombre, precio, stock, categoria, imagenUrl } = producto
  const sinStock = stock <= 0

  return (
    <article className={`tarjeta-producto ${sinStock ? 'tarjeta-producto--sin-stock' : ''}`}>
      <Link to={rutaProducto(id)} className="tarjeta-producto__enlace-imagen">
        <div className="tarjeta-producto__imagen-contenedor">
          {imagenUrl ? (
            <img src={imagenUrl} alt={nombre} className="tarjeta-producto__imagen" loading="lazy" />
          ) : (
            <div className="tarjeta-producto__sin-foto">Sin imagen</div>
          )}
          {sinStock && <span className="tarjeta-producto__badge-stock">Sin stock</span>}
          {categoria && <span className="tarjeta-producto__badge-categoria">{categoria}</span>}
        </div>
      </Link>

      <div className="tarjeta-producto__info">
        <h3 className="tarjeta-producto__titulo">
          <Link to={rutaProducto(id)} title={nombre}>
            {nombre}
          </Link>
        </h3>

        <div className="tarjeta-producto__detalles">
          <p className="tarjeta-producto__precio">{formatearPrecio(precio)}</p>
          <span className="tarjeta-producto__stock">
            {sinStock ? 'Agotado' : `${stock} disponibles`}
          </span>
        </div>

        <div className="tarjeta-producto__acciones">
          <Boton
            variante="primario"
            anchoCompleto
            deshabilitado={sinStock}
            onClick={() => onAgregarAlCarrito && onAgregarAlCarrito(producto)}
          >
            {sinStock ? 'Sin stock' : 'Agregar al carrito'}
          </Boton>
        </div>
      </div>
    </article>
  )
}
