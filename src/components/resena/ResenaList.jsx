import { Cargando, MensajeError, MensajeVacio } from '../ui/Estado'
import './ResenaList.css'

// Convierte una puntuación 1-5 en estrellas para mostrar
function estrellas(puntuacion) {
  return '★'.repeat(puntuacion) + '☆'.repeat(5 - puntuacion)
}

/*
 * Lista de reseñas de un producto (Persona 6).
 * Props:
 *  - resenas: ResenaResponse[]
 *  - cargando / error: estado del pedido a la API
 */
export default function ResenaList({ resenas, cargando, error }) {
  if (cargando) return <Cargando texto="Cargando reseñas…" />

  if (error) return <MensajeError mensaje={error} />

  if (!resenas.length) {
    return (
      <MensajeVacio titulo="Todavía no hay reseñas">
        <p>Sé el primero en dejar tu opinión sobre este producto.</p>
      </MensajeVacio>
    )
  }

  const promedio =
    resenas.reduce((suma, r) => suma + r.puntuacion, 0) / resenas.length

  return (
    <>
      <div className="resenas__titulo">
        <h2>Reseñas ({resenas.length})</h2>
        <span className="resenas__promedio">
          Promedio: {promedio.toFixed(1)} / 5
        </span>
      </div>

      <ul className="resenas__lista">
        {resenas.map((resena) => (
          <li className="resena" key={resena.id}>
            <div className="resena__cabecera">
              <span
                className="resena__puntuacion"
                aria-label={`Puntuación: ${resena.puntuacion} de 5`}
              >
                {estrellas(resena.puntuacion)}
              </span>
            </div>
            <p className="resena__comentario">{resena.comentario}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
