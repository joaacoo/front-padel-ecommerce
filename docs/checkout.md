# Checkout y pedidos

Contrato verificado en el backend local `padel-ecommerce`: los DTO se llaman
`CrearPedidoRequest` y `PedidoResponse` (equivalentes a PedidoRequestDTO y
PedidoResponseDTO de la tarea).

- `POST /api/pedidos`: envía solamente `{ "usuarioId": 1 }`.
- Respuesta: `{ "id": 1024, "fecha": "2026-10-08T21:30:00", "total": 274800 }`.
- `GET /api/pedidos/usuario/{id}`: devuelve una lista con esa misma estructura.
- No hay campos de dirección, pago, estado ni detalle de productos en estos DTO.

El checkout toma el usuario de AuthContext, permite revisar productos, cantidades
y subtotales, y bloquea el envío mientras confirma. Solo vacía el carrito local
después de una respuesta exitosa. La confirmación se muestra en `/checkout`, como
indica el wireflow; al recargar, el pedido se puede consultar en “Mis pedidos”.
El total de confirmación es el que devuelve el servicio.

## Modo local

Con `USAR_MOCKS = true`, `pedido.json` define el ejemplo de respuesta y
`pedidos.json` inicia el historial vacío. Cada compra genera un id y fecha nuevos,
calcula el total del carrito y persiste el historial en `padel_pedidos_{usuarioId}`.
El stock local se valida, pero no se descuenta del catálogo estático de productos.
Los datos simulados no se envían al backend al cambiar de modo.

## API real

El carrito existente se guarda localmente. Antes de crear un pedido, el servicio
sincroniza su contenido con `/api/carrito`: elimina productos ausentes, agrega
los nuevos y actualiza cantidades por id de ítem. Si falla, no envía el pedido.
Esta sincronización no es una transacción: puede quedar parcial, y el próximo
intento vuelve a consultar las diferencias. El backend confirma, valida stock,
calcula total y vacía su carrito en una transacción.

Para probar contra backend se necesita `USAR_MOCKS = false`, una sesión con id
válido y el token en `localStorage.token`. La integración de autenticación sigue
pendiente: `usuarioService.js` usa su propio mock y actualmente no guarda un JWT.
No se verificó este flujo contra un servidor activo.

El botón evita dobles envíos mientras esta pantalla espera. La API no ofrece una
clave de idempotencia: si se pierde la respuesta de un POST, hay que consultar
“Mis pedidos” antes de volver a confirmar, tal como indica el mensaje de error.

## Verificación

Pruebas de servicio: `node --test tests/pedidoService.test.mjs`.
Compilación: `npm run build`.

Recorrido manual: iniciar sesión, agregar productos, ir al carrito y checkout,
editar cantidades, confirmar, verificar que el carrito quede vacío, abrir
“Mis pedidos” y recargar. Revisar también sesión ausente, carrito vacío, error
de red y anchos de escritorio y móvil. No se ejecutó verificación visual en navegador.
