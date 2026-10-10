import './Boton.css'

/*
 * Botón reutilizable.
 * Props:
 *  - variante: 'primario' (azul) | 'secundario' (borde negro) | 'oscuro' (negro) | 'peligro' (rojo, sin fondo)
 *  - el resto (onClick, type, disabled, children...) pasa directo al <button>.
 *
 * Uso: <Boton variante="primario" onClick={guardar}>Guardar</Boton>
 */
export default function Boton({ variante = 'primario', type = 'button', className = '', ...resto }) {
  return <button type={type} className={`boton boton--${variante} ${className}`} {...resto} />
}
