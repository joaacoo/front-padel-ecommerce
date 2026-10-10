import { MensajeVacio } from './Estado'

/*
 * Marcador para las pantallas que todavía no se desarrollaron.
 * Quien toma la pantalla reemplaza este componente por la pantalla real.
 *
 * Props:
 *  - titulo:      nombre de la pantalla
 *  - responsable: quién la desarrolla (según el reparto de roles)
 *  - children:    qué tiene que mostrar
 */
export default function EnConstruccion({ titulo, responsable, children }) {
  return (
    <section className="contenedor" style={{ paddingBlock: 'var(--espacio-6)' }}>
      <h1>{titulo}</h1>
      <MensajeVacio titulo={`Pantalla en construcción · ${responsable}`}>{children}</MensajeVacio>
    </section>
  )
}
