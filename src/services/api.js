/*
 * Configuración central de la comunicación con el backend.
 *
 * USAR_MOCKS = true  → cada pedido lee un JSON local de public/data/ (no hace falta el backend).
 * USAR_MOCKS = false → cada pedido va al backend real de Spring Boot.
 *
 * Es el ÚNICO interruptor que hay que tocar para pasar de datos locales a la API real.
 * En los dos casos se usa fetch, así que los componentes no cambian.
 */
export const USAR_MOCKS = true

export const API_URL = 'http://localhost:8080'

// Error con el código HTTP, para que la pantalla pueda decidir qué mostrar.
export class ErrorApi extends Error {
  constructor(estado, mensaje) {
    super(mensaje)
    this.estado = estado
  }
}

/*
 * Hace un pedido y devuelve el JSON de la respuesta.
 *
 *   mock   → archivo de public/data/ que simula la respuesta (ej.: 'products.json')
 *   ruta   → endpoint del backend (ej.: '/api/productos')
 *   metodo → 'GET' | 'POST' | 'PUT' | 'DELETE'
 *   cuerpo → objeto que se manda como JSON (POST y PUT)
 *
 * En modo mocks siempre se hace un GET al archivo local: el archivo representa
 * la respuesta que devolvería el backend para ese pedido.
 *
 * Ejemplo de cómo se usa desde un servicio (services/<dominio>Service.js):
 *   export const obtenerProductos = () => pedir({ mock: 'products.json', ruta: '/api/productos' })
 */
export async function pedir({ mock, ruta, metodo = 'GET', cuerpo }) {
  if (USAR_MOCKS) {
    return leerRespuesta(await fetch(`/data/${mock}`))
  }

  const headers = {}
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json'

  // El token del login viaja en cada pedido protegido.
  // Convención: el Login lo guarda con localStorage.setItem('token', ...) (ver docs/guia-frontend.md).
  const token = localStorage.getItem('token')
  if (token) headers.Authorization = `Bearer ${token}`

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers,
    body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
  })
  return leerRespuesta(respuesta)
}

async function leerRespuesta(respuesta) {
  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await leerMensajeDeError(respuesta))
  }
  // 204 No Content: el backend no devuelve cuerpo (por ejemplo, al eliminar).
  if (respuesta.status === 204) return null
  return respuesta.json()
}

// El backend devuelve { "error": "..." } o { "campo": "mensaje", ... } (ver docs/contrato-api.md).
async function leerMensajeDeError(respuesta) {
  try {
    const datos = await respuesta.json()
    return datos.error ?? Object.values(datos).join('. ')
  } catch {
    return `Error ${respuesta.status}`
  }
}
