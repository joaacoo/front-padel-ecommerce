const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarLogin({ email, password }) {
  const errores = {}
  if (!email?.trim()) errores.email = 'El email es obligatorio'
  else if (!EMAIL_REGEX.test(email.trim())) errores.email = 'Ingresá un email válido'
  if (!password) errores.password = 'La contraseña es obligatoria'
  return errores
}

export function validarRegistro(datos) {
  const errores = {}
  const { nombre, apellido, nombreUsuario, email, password, confirmarPassword, fechaNacimiento } = datos

  if (!nombre?.trim()) errores.nombre = 'El nombre es obligatorio'
  if (!apellido?.trim()) errores.apellido = 'El apellido es obligatorio'
  if (!nombreUsuario?.trim()) errores.nombreUsuario = 'El nombre de usuario es obligatorio'

  if (!email?.trim()) errores.email = 'El email es obligatorio'
  else if (!EMAIL_REGEX.test(email.trim())) errores.email = 'Ingresá un email válido'

  if (!password) errores.password = 'La contraseña es obligatoria'
  else if (password.length < 6) errores.password = 'Mínimo 6 caracteres'

  if (confirmarPassword !== password) errores.confirmarPassword = 'Las contraseñas no coinciden'

  if (fechaNacimiento && new Date(fechaNacimiento) > new Date()) {
    errores.fechaNacimiento = 'La fecha no puede ser futura'
  }
  return errores
}