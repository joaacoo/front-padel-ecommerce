# Contrato de datos — Frontend ↔ Backend

Define la forma exacta de cada JSON que viaja entre el front (React) y el back (Spring Boot).
Sale de los DTOs del backend (`src/main/java/com/uade/e_commerce/dto`).

**Regla para el equipo:** los JSON de `public/data/` copian **exactamente** estos ejemplos: mismos nombres de campo y mismos tipos. Así, cuando se conecte la API real, solo cambia la URL del `fetch` (`USAR_MOCKS = false` en `src/services/api.js`).

---

## 1. Reglas generales

| Tema | Regla |
|---|---|
| Base URL | `http://localhost:8080` |
| Formato | JSON. En POST y PUT se envía el header `Content-Type: application/json` |
| Autenticación | Después del login, cada pedido protegido lleva `Authorization: Bearer <token>` (lo agrega `api.js`) |
| Números | Sin `$` y sin puntos de miles: `245000`, no `"$245.000"` |
| Fechas | Texto ISO: `"2026-10-08T21:30:00"`. El front lo formatea para mostrarlo (`utils/formato.js`) |

### Errores

| Código | Cuándo | Cuerpo |
|---|---|---|
| 400 | Datos inválidos (validación del DTO) | `{ "email": "El email no tiene un formato valido" }` (un campo por error) |
| 400 | Regla de negocio (ej.: stock insuficiente) | `{ "error": "Stock insuficiente para el producto: Paleta Control 360" }` |
| 401 | Sin token, token vencido o login incorrecto | — |
| 403 | Logueado pero sin permiso (ej.: un USER que crea un producto) | — |
| 404 | No existe el recurso | `{ "error": "..." }` |

---

## 2. Archivos JSON locales (`public/data/`)

Cada archivo simula la respuesta de un endpoint y lo crea la persona responsable de esa pantalla. `products.json` es el nombre que fija la consigna; el resto son nombres sugeridos para que todos usemos los mismos.

| Archivo | Simula | DTO | Responsable |
|---|---|---|---|
| `products.json` | `GET /api/productos` | `ProductoResponse[]` | Persona 2 |
| `categorias.json` | `GET /api/productos/categorias` | `string[]` | Persona 2 |
| `producto-detalle.json` | `GET /api/productos/{id}` | `ProductoResponse` | Persona 3 |
| `carrito.json` | `GET /api/carrito` | `ItemCarritoResponse[]` | Persona 3 |
| `item-carrito.json` | `POST /api/carrito/productos`, `PUT /api/carrito/items/{id}` | `ItemCarritoResponse` | Persona 3 |
| `pedido.json` | `POST /api/pedidos`, `GET /api/pedidos/{id}` | `PedidoResponse` | Persona 4 |
| `pedidos.json` | `GET /api/pedidos/usuario/{id}` | `PedidoResponse[]` | Persona 4 |
| `login.json` | `POST /api/auth/login` | `AuthResponse` (propuesto, ver hueco 1) | Persona 5 |
| `usuario.json` | `POST /api/usuarios/register`, `GET /api/usuarios/{id}` | `UsuarioResponse` | Persona 5 |
| `resenas.json` | `GET /api/resenas/producto/{id}` | `ResenaResponse[]` | Persona 6 |
| `resena.json` | `POST /api/resenas/producto/{id}` | `ResenaResponse` | Persona 6 |
| `vacio.json` | Respuestas 204 (eliminar, vaciar) | — | Ya está |

---

## 3. Acceso (Persona 5)

### Login
`POST /api/auth/login` · público

Envía (`LoginUsuarioRequest`):
```json
{ "email": "lucas@example.com", "password": "123456" }
```
Devuelve **200** (`AuthResponse`), hoy:
```json
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
```
Propuesto (hueco 1), y es lo que debe tener `login.json`:
```json
{ "token": "eyJhbGciOiJIUzI1NiJ9...", "id": 1, "nombre": "Lucas", "rol": "USER" }
```
El front guarda `token` y `rol` en `localStorage` (convención de `docs/guia-frontend.md`, sección 5).

### Registro
`POST /api/usuarios/register` · público

Envía (`RegistroUsuarioRequest`):
```json
{
  "nombre": "Lucas",
  "apellido": "Fernández",
  "nombreUsuario": "lucasf",
  "email": "lucas@example.com",
  "password": "123456"
}
```
Obligatorios en el backend: `nombre`, `email`, `password`. Opcionales: `sexo`, `fechaNacimiento` (`"2000-05-20"`).
Devuelve **201** (`UsuarioResponse`). **No** devuelve token: después de registrarse, el usuario va a Login.

### Perfil
`GET /api/usuarios/{id}` → **200** `UsuarioResponse`:
```json
{ "id": 1, "nombre": "Lucas", "email": "lucas@example.com", "sexo": null, "fechaNacimiento": null }
```
El backend no tiene endpoint para modificar el usuario: el perfil es solo de consulta.

---

## 4. Productos (Personas 2 y 3)

Todas las pantallas de productos usan el mismo DTO, `ProductoResponse`:
```json
{
  "id": 3,
  "nombre": "Paleta Control 360",
  "descripcion": "Paleta de control ideal para jugadores que buscan precisión.",
  "precio": 245000,
  "stock": 15,
  "categoria": "Paletas",
  "imagenUrl": "https://.../paleta-control-360.jpg"
}
```

| Pantalla | Pedido | Devuelve |
|---|---|---|
| Listado: todos los productos | `GET /api/productos` | `ProductoResponse[]`, ya ordenado A-Z por el backend |
| Listado: categorías | `GET /api/productos/categorias` | `["Accesorios", "Paletas", "Pelotas"]` |
| Listado por categoría | `GET /api/productos/categoria/{categoria}` | `ProductoResponse[]` (puede venir vacío) |
| Detalle | `GET /api/productos/{id}` | `ProductoResponse` · 404 si no existe |

Son públicos (no necesitan token).

- **Sin stock:** si `stock === 0`, el front muestra "Sin stock" y deshabilita "Agregar al carrito". El backend lo vuelve a validar.
- **Búsqueda:** el backend no tiene endpoint de búsqueda.

---

## 5. Carrito (Persona 3)

Requieren token. Cada ítem es un `ItemCarritoResponse`:
```json
{ "id": 10, "productoId": 3, "productoNombre": "Paleta Control 360", "cantidad": 1, "precioUnitario": 245000 }
```

| Acción | Pedido (hoy) | Envía | Devuelve |
|---|---|---|---|
| Ver carrito | `GET /api/carrito?usuarioId={id}` | — | **200** `ItemCarritoResponse[]` |
| Agregar | `POST /api/carrito/productos?usuarioId={id}` | `{ "productoId": 3, "cantidad": 1, "precioUnitario": 245000 }` | **201** `ItemCarritoResponse` · 400 si no hay stock |
| Cambiar cantidad | `PUT /api/carrito/items/{itemId}` | `{ "cantidad": 2 }` | **200** `ItemCarritoResponse` |
| Eliminar producto | `DELETE /api/carrito/productos/{productoId}?usuarioId={id}` | — | **204** |
| Vaciar | `DELETE /api/carrito?usuarioId={id}` | — | **204** |

- El backend no devuelve el total del carrito. El total que vale es el que calcula al confirmar el pedido.
- Hoy el backend pide `usuarioId` y `precioUnitario` (huecos 2 y 6).

---

## 6. Pedidos (Persona 4)

`PedidoResponse`:
```json
{ "id": 1024, "fecha": "2026-10-08T21:30:00", "total": 274800 }
```

| Acción | Pedido (hoy) | Envía | Devuelve |
|---|---|---|---|
| Confirmar (Checkout) | `POST /api/pedidos` | `{ "usuarioId": 1 }` (`CrearPedidoRequest`) | **201** `PedidoResponse` · 400 si el carrito está vacío o no hay stock |
| Mis pedidos | `GET /api/pedidos/usuario/{id}` | — | **200** `PedidoResponse[]` |
| Un pedido | `GET /api/pedidos/{id}` | — | **200** `PedidoResponse` · 404 |

Sin medio de pago: el TPO dice "sin procesamiento de pago". Al confirmar, el backend valida y descuenta el stock.

---

## 7. Reseñas (Persona 6)

`ResenaResponse`:
```json
{ "id": 5, "productoId": 3, "usuarioId": 12, "comentario": "Excelente control.", "puntuacion": 5 }
```

| Acción | Pedido | Envía | Devuelve |
|---|---|---|---|
| Ver reseñas de un producto | `GET /api/resenas/producto/{id}` | — | **200** `ResenaResponse[]` · público |
| Crear reseña | `POST /api/resenas/producto/{id}` | `{ "usuarioId": 1, "comentario": "...", "puntuacion": 5 }` (`CrearResenaRequest`) | **201** `ResenaResponse` |
| Eliminar reseña | `DELETE /api/resenas/{id}` | — | **204** · solo ADMIN |

`puntuacion` va de 1 a 5 y `comentario` es obligatorio.

---

## 8. Administración de productos (sin asignar)

El TPO pide "Gestión de Productos", pero no está en el reparto de roles.

| Pantalla | Pedido | Envía | Devuelve |
|---|---|---|---|
| Mis productos | `GET /api/productos` | — | **200** `ProductoResponse[]` |
| Publicar | `POST /api/productos` | `ProductoRequest` | **201** `ProductoResponse` |
| Editar / cambiar stock | `PUT /api/productos/{id}` | `ProductoRequest` completo | **200** `ProductoResponse` |
| Eliminar | `DELETE /api/productos/{id}` | — | **204** |

`ProductoRequest`: `nombre`* , `descripcion`, `precio`* (> 0), `stock`* (≥ 0), `categoria`*, `imagenUrl`.

---

## 9. Huecos del backend (pendientes)

| # | Problema | Consecuencia | Propuesta |
|---|---|---|---|
| 1 | El login devuelve solo `{ token }` | El front no sabe el id ni el rol del usuario | Devolver `{ token, id, nombre, rol }` |
| 2 | `AgregarItemRequest` recibe `precioUnitario` del front y el total del pedido se calcula con ese precio | Si alguien manda `"precioUnitario": 1`, la paleta cuesta $1 | Usar `producto.getPrecio()` en `CarritoService` |
| 3 | No hay CORS configurado | El navegador bloquea los pedidos del front (5173) al back (8080) | Habilitar CORS para `http://localhost:5173` |
| 4 | Una sola `imagenUrl` por producto; `ItemCarritoResponse` no trae imagen | El TPO pide una o más fotos; el carrito no puede mostrar la foto | Lista de imágenes; `imagenUrl` en el ítem |
| 5 | `USO_API.md` dice `/api/users/...` | Documentación equivocada | Corregir a `/api/usuarios/...` |
| 6 | Carrito, pedidos y reseñas reciben `usuarioId` del front | Un usuario logueado puede ver o cambiar lo de otro | Sacar al usuario del token |
| 7 | `apellido` y `nombreUsuario` son opcionales en el registro | El TPO los pide como obligatorios | Agregar `@NotBlank` |
| 8 | `Producto` no tiene usuario dueño | El TPO dice que quien publica maneja su stock | Relación `Producto` → `Usuario` |
| 9 | `imagenUrl` es un texto: no hay subida de archivos | El TPO dice "adjuntando una o más fotos" | Por ahora, una URL |
| 10 | `ResenaResponse` trae `usuarioId` pero no el nombre | La reseña no puede mostrar quién la escribió | Agregar `usuarioNombre` |
