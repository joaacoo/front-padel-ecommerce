// Normaliza un item del carrito para mantener compatibilidad entre backend y mocks
export function normalizarItem(item) {
  return {
    id: item.id || item.productoId,
    productoId: item.productoId ?? item.producto?.id ?? item.id,
    productoNombre: item.productoNombre ?? item.producto?.nombre ?? item.nombre,
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario ?? item.producto?.precio ?? item.precio,
    imagenUrl: item.imagenUrl ?? item.producto?.imagenUrl ?? '',
    stock: item.stock ?? item.producto?.stock ?? 999
  }
}

// Verifica si hay stock suficiente antes de agregar un producto al carrito
export function tieneStockDisponible(items, producto, cantidad = 1) {
  if (!Number.isInteger(cantidad) || cantidad <= 0) return false
  const existente = items.find((item) => item.productoId === producto.id)
  const cantidadActual = existente?.cantidad ?? 0
  return cantidadActual + cantidad <= producto.stock
}
