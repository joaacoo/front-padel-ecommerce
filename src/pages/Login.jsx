import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'
import { validarLogin } from '../utils/validaciones'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorServidor('')
    const erroresForm = validarLogin(form)
    setErrores(erroresForm)
    if (Object.keys(erroresForm).length > 0) return

    setCargando(true)
    try {
      await login(form)
      navigate(location.state?.desde || '/', { replace: true })
    } catch (err) {
      setErrorServidor(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Iniciar sesión</h1>
        {errorServidor && <div className="form-alert" role="alert">{errorServidor}</div>}

        <FormField label="Email" name="email" type="email" autoComplete="email"
          value={form.email} onChange={handleChange} error={errores.email} />
        <FormField label="Contraseña" name="password" type="password" autoComplete="current-password"
          value={form.password} onChange={handleChange} error={errores.password} />

        <button type="submit" className="btn btn-primary" disabled={cargando}>
          {cargando ? 'Ingresando…' : 'Ingresar'}
        </button>
        <p className="auth-switch">¿No tenés cuenta? <Link to="/registro">Registrate</Link></p>
      </form>
    </main>
  )
}