import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { crearResena } from '../../services/resenaService'
import { validarResena } from '../../utils/validaciones'
import { RUTAS } from '../../routes/rutas'
import FormField from '../FormField'
import Boton from '../ui/Boton'
import { MensajeError } from '../ui/Estado'
import './ResenaForm.css'

/*
 * Formulario para dejar una reseña (Persona 6).
 * Props:
 *  - productoId: id del producto que se está reseñando
 *  - onCreada: se llama con la reseña creada, para actualizar la lista
 */
export default function ResenaForm({ productoId, onCreada }) {
  const { usuario } = useAuth()
  const [puntuacion, setPuntuacion] = useState(0)
  const [comentario, setComentario] = useState('')
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  if (!usuario?.id) {
    return (
      <p className="resena-form__sin-sesion">
        Para dejar una reseña, <Link to={RUTAS.LOGIN}>iniciá sesión</Link>.
      </p>
    )
  }

  async function enviar(event) {
    event.preventDefault()

    const erroresValidacion = validarResena({ comentario, puntuacion })
    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length) return

    setEnviando(true)
    setError('')
    try {
      const creada = await crearResena(
        productoId,
        usuario.id,
        comentario.trim(),
        puntuacion
      )
      onCreada(creada)
      setComentario('')
      setPuntuacion(0)
      setExito(true)
    } catch (err) {
      setError(err.message || 'No pudimos guardar tu reseña.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="resena-form" onSubmit={enviar} aria-busy={enviando}>
      <h3>Dejá tu reseña</h3>

      <FormField label="Puntuación" name="puntuacion" error={errores.puntuacion}>
        <div className="resena-form__estrellas" role="radiogroup" aria-label="Puntuación de 1 a 5">
          {[1, 2, 3, 4, 5].map((valor) => (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={puntuacion === valor}
              aria-label={`${valor} de 5`}
              className={
                valor <= puntuacion
                  ? 'resena-form__estrella resena-form__estrella--activa'
                  : 'resena-form__estrella'
              }
              onClick={() => setPuntuacion(valor)}
            >
              ★
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="Comentario" name="comentario" error={errores.comentario}>
        <textarea
          id="comentario"
          name="comentario"
          value={comentario}
          onChange={(event) => setComentario(event.target.value)}
          aria-invalid={!!errores.comentario}
        />
      </FormField>

      {error && <MensajeError mensaje={error} />}
      {exito && <p className="resena-form__exito" role="status">¡Gracias por tu reseña!</p>}

      <Boton type="submit" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar reseña'}
      </Boton>
    </form>
  )
}
