import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'
import { validarRegistro } from '../utils/validaciones'

const INICIAL = {
  nombre: '', apellido: '', nombreUsuario: '', email: '',
  password: '', confirmarPassword: '', sexo: 'M', fechaNacimiento: '',
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(INICIAL)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorServidor('')
    const erroresForm = validarRegistro(form)
    setErrores(erroresForm)
    if (Object.keys(erroresForm).length > 0) return

    setCargando(true)
    try {
      // confirmarPassword es solo del front: no forma parte de RegistroUsuarioRequest
      // eslint-disable-next-line no-unused-vars
      const { confirmarPassword, ...datos } = form
      await register(datos)
      navigate('/', { replace: true })
    } catch (err) {
      setErrorServidor(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Crear cuenta</h1>
        {errorServidor && <div className="form-alert" role="alert">{errorServidor}</div>}

        <div className="form-row">
          <FormField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} error={errores.nombre} />
          <FormField label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} error={errores.apellido} />
        </div>
        <FormField label="Nombre de usuario" name="nombreUsuario" value={form.nombreUsuario}
          onChange={handleChange} error={errores.nombreUsuario} />
        <FormField label="Email" name="email" type="email" autoComplete="email"
          value={form.email} onChange={handleChange} error={errores.email} />
        <div className="form-row">
          <FormField label="Contraseña" name="password" type="password" autoComplete="new-password"
            value={form.password} onChange={handleChange} error={errores.password} />
          <FormField label="Repetir contraseña" name="confirmarPassword" type="password" autoComplete="new-password"
            value={form.confirmarPassword} onChange={handleChange} error={errores.confirmarPassword} />
        </div>
        <div className="form-row">
          <FormField label="Sexo" name="sexo">
            <select id="sexo" name="sexo" value={form.sexo} onChange={handleChange}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </FormField>
          <FormField label="Fecha de nacimiento" name="fechaNacimiento" type="date"
            value={form.fechaNacimiento} onChange={handleChange} error={errores.fechaNacimiento} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={cargando}>
          {cargando ? 'Creando cuenta…' : 'Registrarme'}
        </button>
        <p className="auth-switch">¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
      </form>
    </main>
  )
}