/*
 * Todas las URLs de la app en un solo lugar.
 * Regla: nunca escribir una URL a mano en un componente. Usar RUTAS o las funciones de abajo.
 * Así, si una URL cambia, se cambia solo acá.
 */
export const RUTAS = {
  // Públicas
  LOGIN: '/login',
  REGISTRO: '/registro',

  // Con login
  PRODUCTOS: '/',
  PRODUCTO: '/producto/:id',
  CARRITO: '/carrito',
  CHECKOUT: '/checkout',
  MIS_PEDIDOS: '/mis-pedidos',
  PERFIL: '/perfil',

  // Solo ADMIN
  MIS_PRODUCTOS: '/admin/productos',
  PUBLICAR_PRODUCTO: '/admin/productos/nuevo',
  EDITAR_PRODUCTO: '/admin/productos/:id/editar',
}

// Para armar URLs con parámetros: rutaProducto(3) → "/producto/3"
export const rutaProducto = (id) => `/producto/${id}`
export const rutaEditarProducto = (id) => `/admin/productos/${id}/editar`

/*
 * Mientras no exista la pantalla de Login (Persona 5), las rutas protegidas
 * dejan pasar a todos, así cada uno puede ver y probar su pantalla.
 * Cuando el Login guarde 'token' y 'rol' en localStorage, se cambia a true.
 */
export const PROTEGER_RUTAS = false
