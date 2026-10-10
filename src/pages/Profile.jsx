import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usuarioService } from '../services/usuarioService'

const SEXOS = { M: 'Masculino', F: 'Femenino', Otro: 'Otro' }

// El backend solo expone GET /api/users/{id}: El perfil esta solo en modo lectura
export default function Profile() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(usuario)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    usuarioService.getById(usuario.id)
      .then((data) => activo && setPerfil(data))
      .catch((err) => activo && setError(err.message))
    return () => { activo = false }
  }, [usuario.id])

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Mi perfil</h1>
        {error && <div className="form-alert" role="alert">{error}</div>}
        <dl className="profile-list">
          <div><dt>Nombre</dt><dd>{perfil.nombre}</dd></div>
          <div><dt>Email</dt><dd>{perfil.email}</dd></div>
          <div><dt>Sexo</dt><dd>{SEXOS[perfil.sexo] || perfil.sexo || '—'}</dd></div>
          <div><dt>Fecha de nacimiento</dt><dd>{perfil.fechaNacimiento || '—'}</dd></div>
        </dl>
        <button type="button" className="btn" onClick={() => { logout(); navigate('/') }}>
          Cerrar sesión
        </button>
      </section>
    </main>
  )
}