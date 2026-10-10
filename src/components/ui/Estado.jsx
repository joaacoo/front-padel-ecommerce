import './Estado.css'

/*
 * Mensajes de estado que repiten todas las pantallas que piden datos:
 *  <Cargando />                       mientras llega la respuesta
 *  <MensajeError mensaje="..." />     si el pedido falló
 *  <MensajeVacio titulo="..." />      si la lista vino vacía
 */
export function Cargando({ texto = 'Cargando…' }) {
  return (
    <p className="estado" role="status">
      {texto}
    </p>
  )
}

export function MensajeError({ mensaje }) {
  return (
    <p className="estado estado--error" role="alert">
      {mensaje}
    </p>
  )
}

export function MensajeVacio({ titulo, children }) {
  return (
    <div className="estado estado--vacio">
      <strong>{titulo}</strong>
      {children}
    </div>
  )
}
