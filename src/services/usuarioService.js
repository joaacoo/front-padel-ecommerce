const USE_MOCK = true
const BASE_URL = '/api/users'
const MOCK_URL = '/data/usuario.json'

async function request(url, options) {
  let res
  try {
    res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    // El back responde { "error": "mensaje" } (GlobalExceptionHandler)
    throw new Error(data.error || 'Ocurrió un error inesperado')
  }
  return data
}

// POST /api/users/login  -> LoginUsuarioRequest { email, password } -> UsuarioResponse
function login({ email, password }) {
  if (USE_MOCK) return request(MOCK_URL)
  return request(`${BASE_URL}/login`, { method: 'POST', body: JSON.stringify({ email, password }) })
}

// POST /api/users/register -> RegistroUsuarioRequest -> UsuarioResponse
async function register(datos) {
  if (USE_MOCK) {
    const base = await request(MOCK_URL)
    return { ...base, nombre: datos.nombre, email: datos.email, sexo: datos.sexo, fechaNacimiento: datos.fechaNacimiento }
  }
  const { nombre, apellido, nombreUsuario, email, password, sexo, fechaNacimiento } = datos
  return request(`${BASE_URL}/register`, {
    method: 'POST',
    body: JSON.stringify({ nombre, apellido, nombreUsuario, email, password, sexo, fechaNacimiento: fechaNacimiento || null }),
  })
}

// GET /api/users/{id} -> UsuarioResponse
async function getById(id) {
  if (USE_MOCK) {
    const base = await request(MOCK_URL)
    // En mock devolvemos al usuario registrado/logueado si coincide el id
    try {
      const guardado = JSON.parse(localStorage.getItem('padel_usuario'))
      if (guardado && guardado.id === Number(id)) return guardado
    } catch {
    }
    return base
  }
  return request(`${BASE_URL}/${id}`)
}

export const usuarioService = { login, register, getById }