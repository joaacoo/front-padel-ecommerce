import { pedir } from './api'

async function login({ email, password }) {
  return pedir({
    mock: 'usuario.json',
    ruta: '/api/auth/login',
    metodo: 'POST',
    cuerpo: { email, password },
  })
}

async function register(datos) {
  const { nombre, apellido, nombreUsuario, email, password, sexo, fechaNacimiento } = datos
  return pedir({
    mock: 'usuario.json',
    ruta: '/api/usuarios/register',
    metodo: 'POST',
    cuerpo: {
      nombre,
      apellido,
      nombreUsuario,
      email,
      password,
      sexo,
      fechaNacimiento: fechaNacimiento || null,
    },
  })
}

async function me() {
  return pedir({
    mock: 'usuario.json',
    ruta: '/api/auth/me',
  })
}

async function logout() {
  return pedir({
    mock: 'vacio.json',
    ruta: '/api/auth/logout',
    metodo: 'POST',
  })
}

async function getById(id) {
  return pedir({
    mock: 'usuario.json',
    ruta: `/api/usuarios/${id}`,
  })
}

export const usuarioService = { login, register, me, logout, getById }
