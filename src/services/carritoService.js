
import { pedir } from './api'

// Obtener productos del carrito
export const obtenerCarrito = (usuarioId) =>
  pedir({
    mock: 'carrito.json',
    ruta: `/api/carrito?usuarioId=${usuarioId}`
  })

// Agregar producto al carrito
export const agregarItem = (usuarioId, productoId, cantidad, precioUnitario) =>
  pedir({
    mock: 'item-carrito.json',
    ruta: `/api/carrito/productos?usuarioId=${usuarioId}`,
    metodo: 'POST',
    cuerpo: {
      productoId,
      cantidad,
      precioUnitario
    }
  })

// Actualizar cantidad de un producto
export const modificarCantidad = (itemId, cantidad) =>
  pedir({
    mock: 'item-carrito.json',
    ruta: `/api/carrito/items/${itemId}`,
    metodo: 'PUT',
    cuerpo: {
      cantidad
    }
  })

// Eliminar producto del carrito
export const quitarProducto = (usuarioId, productoId) =>
  pedir({
    mock: 'vacio.json',
    ruta: `/api/carrito/productos/${productoId}?usuarioId=${usuarioId}`,
    metodo: 'DELETE'
  })

// Vaciar carrito
export const limpiarCarrito = (usuarioId) =>
  pedir({
    mock: 'vacio.json',
    ruta: `/api/carrito?usuarioId=${usuarioId}`,
    metodo: 'DELETE'
  })
