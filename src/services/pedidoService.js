import { pedir, USAR_MOCKS } from './api'
import { obtenerCarrito, agregarItem, modificarCantidad, quitarProducto } from './carritoService'

const clave = (usuarioId) => `padel_pedidos_${usuarioId}`
function validarUsuario(usuarioId) {
  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) throw new Error('Iniciá sesión para consultar o confirmar tus pedidos.')
}
async function leerPedidosMock(usuarioId) {
  const guardados = localStorage.getItem(clave(usuarioId))
  return guardados ? JSON.parse(guardados) : pedir({ mock: 'pedidos.json', ruta: `/api/pedidos/usuario/${usuarioId}` })
}
export async function obtenerPedidos(usuarioId) {
  validarUsuario(usuarioId)
  const pedidos = USAR_MOCKS ? await leerPedidosMock(usuarioId) : await pedir({ ruta: `/api/pedidos/usuario/${usuarioId}` })
  return [...pedidos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}
// Sincronización por diferencias: reintentar no vuelve a sumar cantidades.
async function sincronizarCarrito(usuarioId, items) {
  const remotos = await obtenerCarrito(usuarioId)
  for (const remoto of remotos) {
    if (!items.some((item) => item.productoId === remoto.productoId)) await quitarProducto(usuarioId, remoto.productoId)
  }
  for (const item of items) {
    const remoto = remotos.find((actual) => actual.productoId === item.productoId)
    if (!remoto) await agregarItem(usuarioId, item.productoId, item.cantidad, item.precioUnitario)
    else if (remoto.cantidad !== item.cantidad) await modificarCantidad(remoto.id, item.cantidad)
  }
}
export async function crearPedido(usuarioId, items) {
  validarUsuario(usuarioId)
  if (!items.length) throw new Error('Tu carrito está vacío.')
  for (const item of items) {
    if (!Number.isInteger(item.cantidad) || item.cantidad < 1 || !Number.isFinite(item.precioUnitario) || item.precioUnitario <= 0 || (item.stock !== undefined && item.cantidad > item.stock)) {
      throw new Error(`Revisá la cantidad y disponibilidad de ${item.productoNombre}.`)
    }
  }
  if (!USAR_MOCKS) {
    await sincronizarCarrito(usuarioId, items)
    return pedir({ ruta: '/api/pedidos', metodo: 'POST', cuerpo: { usuarioId } })
  }
  const pedidos = await leerPedidosMock(usuarioId)
  const ejemplo = await pedir({ mock: 'pedido.json', ruta: '/api/pedidos' })
  const pedido = {
    ...ejemplo,
    id: Math.max(ejemplo.id, ...pedidos.map((actual) => actual.id)) + 1,
    fecha: new Date().toISOString(),
    total: Math.round(items.reduce((total, item) => total + item.precioUnitario * item.cantidad, 0) * 100) / 100,
  }
  localStorage.setItem(clave(usuarioId), JSON.stringify([pedido, ...pedidos]))
  return pedido
}
