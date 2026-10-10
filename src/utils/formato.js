// Funciones para mostrar datos del backend en pantalla.

const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

// 245000 → "$ 245.000"
export function formatearPrecio(numero) {
  return formatoPrecio.format(numero)
}

// "2026-10-08T21:30:00" → "08/10/2026 21:30"
export function formatearFecha(textoIso) {
  return new Date(textoIso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
