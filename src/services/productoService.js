import { pedir, USAR_MOCKS } from './api'

/**
 * Servicio de productos (Persona 2).
 * Consume los endpoints definidos en el contrato de API (sección 4).
 */

// Obtiene todos los productos (ordenados por defecto A-Z según backend)
export const obtenerProductos = () =>
  pedir({ mock: 'products.json', ruta: '/api/productos' })

// Obtiene la lista de categorías disponibles
export const obtenerCategorias = () =>
  pedir({ mock: 'categorias.json', ruta: '/api/productos/categorias' })

// Obtiene los productos filtrados por una categoría específica
export const obtenerProductosPorCategoria = (categoria) =>
  pedir({
    mock: 'products.json',
    ruta: `/api/productos/categoria/${encodeURIComponent(categoria)}`,
  })

// Obtiene un producto por su ID (usado también por el detalle)

export const obtenerProductoPorId = async (id) => {
  if (USAR_MOCKS) {
    const productos = await pedir({
      mock: 'products.json',
      ruta: '/api/productos'
    })

    const producto = productos.find(
      (p) => p.id === Number(id)
    )

    if (!producto) {
      throw new Error('Producto no encontrado')
    }

    return producto
  }

  return pedir({
    ruta: `/api/productos/${id}`
  })
}
