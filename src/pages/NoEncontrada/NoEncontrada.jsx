import { Link } from 'react-router-dom'
import { MensajeVacio } from '../../components/ui/Estado'
import { RUTAS } from '../../routes/rutas'

// Se muestra cuando la URL no coincide con ninguna ruta.
export default function NoEncontrada() {
  return (
    <section className="contenedor" style={{ paddingBlock: 'var(--espacio-7)' }}>
      <MensajeVacio titulo="Esta página no existe">
        <Link to={RUTAS.PRODUCTOS}>Volver al inicio</Link>
      </MensajeVacio>
    </section>
  )
}
