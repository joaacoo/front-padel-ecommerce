import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { obtenerProductos, obtenerCategorias } from '../../services/productoService'
import ProductCard from '../../components/producto/ProductCard'
import { Cargando, MensajeError, MensajeVacio } from '../../components/ui/Estado'
import Boton from '../../components/ui/Boton'
import './ProductList.css'

export default function ProductList() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const busqueda = searchParams.get('q') || ''
  const categoriaSeleccionada = searchParams.get('categoria') || 'Todas'
  const orden = searchParams.get('orden') || 'defecto'
  const soloStock = searchParams.get('enStock') === 'true'

  // Carga inicial de productos y categorías
  useEffect(() => {
    let montado = true

    Promise.all([obtenerProductos(), obtenerCategorias()])
      .then(([datosProductos, datosCategorias]) => {
        if (montado) {
          setProductos(datosProductos)
          setCategorias(datosCategorias)
        }
      })
      .catch((err) => {
        if (montado) setError(err.message || 'Error al cargar los productos')
      })
      .finally(() => {
        if (montado) setCargando(false)
      })

    return () => {
      montado = false
    }
  }, [])

  // Actualiza los parámetros de búsqueda en la URL
  const actualizarParametro = (clave, valor) => {
    const nuevosParams = new URLSearchParams(searchParams)
    if (!valor || valor === 'Todas' || valor === 'defecto' || valor === false) {
      nuevosParams.delete(clave)
    } else {
      nuevosParams.set(clave, valor)
    }
    setSearchParams(nuevosParams)
  }

  // Filtrado y ordenamiento en cliente
  const productosFiltrados = useMemo(() => {
    return productos
      .filter((prod) => {
        // Filtro por categoría
        if (categoriaSeleccionada !== 'Todas' && prod.categoria !== categoriaSeleccionada) {
          return false
        }
        // Filtro por búsqueda (nombre o descripción)
        if (busqueda.trim() !== '') {
          const termino = busqueda.toLowerCase().trim()
          const coincideNombre = prod.nombre?.toLowerCase().includes(termino)
          const coincideDesc = prod.descripcion?.toLowerCase().includes(termino)
          if (!coincideNombre && !coincideDesc) return false
        }
        // Filtro solo con stock
        if (soloStock && prod.stock <= 0) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        if (orden === 'precio-asc') return a.precio - b.precio
        if (orden === 'precio-desc') return b.precio - a.precio
        if (orden === 'nombre-asc') return a.nombre.localeCompare(b.nombre)
        return 0
      })
  }, [productos, busqueda, categoriaSeleccionada, soloStock, orden])

  const manejarAgregarAlCarrito = (producto) => {
    // Feedback visual básico (la lógica completa del carrito la define Persona 3)
    alert(`¡Agregaste "${producto.nombre}" al carrito!`)
  }

  const limpiarFiltros = () => {
    setSearchParams({})
  }

  if (cargando) return <Cargando texto="Cargando catálogo de productos..." />
  if (error) return <MensajeError mensaje={error} />

  return (
    <div className="catalogo contenedor">
      {/* Encabezado y barra de búsqueda */}
      <header className="catalogo__header">
        <h1 className="catalogo__titulo">Catálogo de Productos</h1>
        <div className="catalogo__buscador-wrap">
          <input
            type="search"
            placeholder="Buscar por paleta, pelotas, calzado..."
            value={busqueda}
            onChange={(e) => actualizarParametro('q', e.target.value)}
            className="catalogo__input-buscar"
            aria-label="Buscar productos"
          />
        </div>
      </header>

      {/* Franja de categorías */}
      <div className="catalogo__categorias" role="tablist" aria-label="Categorías de productos">
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`catalogo__tag-categoria ${
              categoriaSeleccionada === cat ? 'catalogo__tag-categoria--activa' : ''
            }`}
            onClick={() => actualizarParametro('categoria', cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Barra de control y filtros */}
      <div className="catalogo__controles">
        <div className="catalogo__resumen">
          <span>Mostrando <strong>{productosFiltrados.length}</strong> productos</span>
        </div>

        <div className="catalogo__filtros-fila">
          <label className="catalogo__filtro-checkbox">
            <input
              type="checkbox"
              checked={soloStock}
              onChange={(e) => actualizarParametro('enStock', e.target.checked)}
            />
            Solo con stock disponible
          </label>

          <div className="catalogo__ordenar">
            <label htmlFor="orden-select">Ordenar por:</label>
            <select
              id="orden-select"
              value={orden}
              onChange={(e) => actualizarParametro('orden', e.target.value)}
              className="catalogo__select"
            >
              <option value="defecto">Recomendados</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="nombre-asc">Nombre: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos o mensaje vacío */}
      {productosFiltrados.length === 0 ? (
        <MensajeVacio titulo="No encontramos productos">
          <p>Prueba ajustando los filtros o el término de búsqueda.</p>
          <div style={{ marginTop: '16px' }}>
            <Boton variante="secundario" onClick={limpiarFiltros}>
              Restablecer filtros
            </Boton>
          </div>
        </MensajeVacio>
      ) : (
        <section className="catalogo__grilla" aria-label="Listado de productos">
          {productosFiltrados.map((prod) => (
            <ProductCard
              key={prod.id}
              producto={prod}
              onAgregarAlCarrito={manejarAgregarAlCarrito}
            />
          ))}
        </section>
      )}
    </div>
  )
}
