import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormField from '../components/FormField'
import { limpiarErrorAuth, loginThunk } from '../store/slices/authSlice'
import { validarLogin } from '../utils/validaciones'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { estaAutenticado, cargando, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errores, setErrores] = useState({})

  useEffect(() => {
    dispatch(limpiarErrorAuth())
  }, [dispatch])

  useEffect(() => {
    if (estaAutenticado) {
      navigate('/', { replace: true })
    }
  }, [estaAutenticado, navigate])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const erroresForm = validarLogin(form)
    setErrores(erroresForm)
    if (Object.keys(erroresForm).length > 0) return

    dispatch(loginThunk(form))
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Iniciar sesión</h1>
        {error && <div className="form-alert" role="alert">{error}</div>}

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
