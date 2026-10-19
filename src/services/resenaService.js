import { pedir, USAR_MOCKS } from './api'

/**
 * Servicio de reseñas (Persona 6).
 * Consume los endpoints definidos en el contrato de API (sección 7).
 */

// Obtiene las reseñas de un producto
export const obtenerResenasPorProducto = async (productoId) => {
  if (USAR_MOCKS) {
    const resenas = await pedir({
      mock: 'resenas.json',
      ruta: `/api/resenas/producto/${productoId}`
    })

    return resenas.filter(
      (r) => r.productoId === Number(productoId)
    )
  }

  return pedir({
    ruta: `/api/resenas/producto/${productoId}`
  })
}

// Crea una reseña para un producto
export const crearResena = (productoId, usuarioId, comentario, puntuacion) =>
  pedir({
    mock: 'resena.json',
    ruta: `/api/resenas/producto/${productoId}`,
    metodo: 'POST',
    cuerpo: {
      usuarioId,
      comentario,
      puntuacion
    }
  })

// Elimina una reseña (solo ADMIN)
export const eliminarResena = (id) =>
  pedir({
    mock: 'vacio.json',
    ruta: `/api/resenas/${id}`,
    metodo: 'DELETE'
  })
