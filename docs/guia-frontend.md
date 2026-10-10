# Guía del frontend

Convenciones que sigue todo el equipo. Antes de abrir un PR, revisá el checklist del final.

- [Contrato de datos](contrato-api.md): la forma de cada JSON entre front y back, y qué archivo crea cada uno.
- [Wireflow](wireflow.md): cómo se navega entre pantallas.
- [Diseño](diseño/): mockups (color), wireframes (gris) y wireflow, en PNG.

---

## 1. Quién hace qué

| Persona | Pantallas | Carpeta |
|---|---|---|
| 1 | Diseño, rutas, estructura, convenciones, integración y revisión | `routes/`, `services/api.js`, `components/layout`, `components/ui`, `styles/`, `utils/`, `docs/` |
| 2 | Listado, búsqueda y filtros | `pages/ProductList`, `components/producto/ProductCard.jsx` |
| 3 | Detalle y carrito | `pages/ProductDetail`, `pages/Carrito` |
| 4 | Checkout, confirmación y mis pedidos | `pages/Checkout`, `pages/MisPedidos` |
| 5 | Login, registro y perfil | `pages/Login.jsx`, `pages/Register.jsx`, `pages/Profile.jsx`, `context/AuthContext.jsx` |
| 6 | Reseñas y revisión final | `components/resena/ResenaList.jsx` (va dentro de `ProductDetail`) |
| Sin asignar | Gestión de productos (admin) | `pages/admin/` |

Cada pantalla pendiente es un archivo marcador (solo para que el router compile) con su ruta, su mockup y la sección del contrato. Quien la toma lo reemplaza entero.

En el encabezado (`Navbar`) hay lugares reservados para otras personas: el buscador y las categorías (Persona 2), el saludo y "Cerrar sesión" (Persona 5, ya conectado con `<AuthStatus />`) y la cantidad del carrito (Persona 3).

---

## 2. Estructura de carpetas

```
public/
└── data/                 JSON locales que simulan al backend (ver contrato, sección 2)
src/
├── main.jsx              Punto de entrada. Envuelve la app en <BrowserRouter>.
├── App.jsx               Mapa de rutas: qué pantalla va en cada URL.
├── routes/
│   ├── rutas.js          Todas las URLs en un solo lugar.
│   ├── RutaProtegida.jsx Pide login.
│   └── RutaAdmin.jsx     Pide rol ADMIN.
├── pages/                Una carpeta por pantalla: Pantalla.jsx + Pantalla.css
├── components/
│   ├── layout/           Lo que rodea a las pantallas: Layout, Navbar, Footer.
│   ├── ui/               Piezas genéricas: Boton, Estado (Cargando, MensajeError, MensajeVacio).
│   ├── producto/         Piezas de productos (ProductCard…).
│   └── resena/           Piezas de reseñas (ResenaList…).
├── services/             La ÚNICA capa que pide datos: api.js + un archivo por dominio
│                         (productoService.js, carritoService.js…) que crea cada persona.
├── styles/               variables.css (colores, fuentes, espacios) y global.css.
└── utils/                Funciones sueltas: formatearPrecio, formatearFecha.
```

**Regla:** una pantalla vive en `pages/`. Si una pieza se usa en dos pantallas o más, va a `components/`.

---

## 3. Rutas

| URL | Pantalla | Acceso |
|---|---|---|
| `/login` | Login | Pública |
| `/registro` | Registro | Pública |
| `/` | ProductList: listado, búsqueda y filtros (cómo se filtra lo decide la Persona 2) | Login |
| `/producto/:id` | ProductDetail (+ reseñas) | Login |
| `/carrito` | Carrito | Login |
| `/checkout` | Checkout y pedido confirmado | Login |
| `/mis-pedidos` | Mis pedidos | Login |
| `/perfil` | Mi perfil | Login |
| `/admin/productos` | Mis productos | ADMIN |
| `/admin/productos/nuevo` | Publicar producto | ADMIN |
| `/admin/productos/:id/editar` | Editar producto (misma pantalla que Publicar) | ADMIN |
| cualquier otra | Página no encontrada | — |

- **Nunca escribas una URL a mano.** Usá `RUTAS.CARRITO`, `rutaProducto(id)`, etc. (`src/routes/rutas.js`). Si necesitás una ruta nueva, se agrega ahí y en `App.jsx`.
- **Parámetros de la URL:** `const { id } = useParams()`.
- **Navegar desde código:** `const navegar = useNavigate(); navegar(RUTAS.CARRITO)`.
- **Links:** `<Link to={rutaProducto(producto.id)}>`, nunca `<a href>` (recargaría toda la página).
- **`PROTEGER_RUTAS`** (en `rutas.js`) queda en `false` hasta que el Login guarde la sesión (ver sección 5). Después se pone en `true`.
- **Las rutas protegidas solo esconden pantallas.** La seguridad real la hace el backend.

---

## 4. Componentes

**Nombres y archivos**
- Componentes y pantallas en `PascalCase`, con los nombres de la consigna: `ProductList.jsx`, `ProductDetail.jsx`, `ProductCard.jsx`, `ResenaList.jsx`.
- Un componente por archivo, exportado con `export default`. Su CSS al lado, con el mismo nombre.
- Variables, funciones y props en `camelCase`: `producto`, `onAgregar`, `cargando`.

**Estilos**
- Las clases llevan el nombre del componente como prefijo: `.product-card`, `.product-card__precio`. Así no se pisan entre archivos.
- Colores, fuentes y espacios **siempre** con variables de `styles/variables.css`: `var(--azul)`, `var(--espacio-4)`. Nunca `#1e5ae8` a mano.
- Responsive: usar `flex-wrap` y `grid` con `repeat(auto-fill, minmax(…))` para que las grillas se acomoden solas en el celular.

**Datos hacia abajo, avisos hacia arriba**
- Un componente **recibe datos por props** y **avisa con funciones** (`onAgregar`, `onEliminar`). No llama a servicios: eso lo decide la pantalla.
- Ejemplo de la convención: una tarjeta recibe `producto` y avisa con `onAgregar(producto)`; la pantalla decide qué hacer.

**Componentes compartidos que ya existen**

| Componente | Para qué | Props |
|---|---|---|
| `Layout` | Encabezado + pantalla + pie (lo aplica el router) | — |
| `Navbar` | Encabezado, con lugares reservados para otras personas | — |
| `Boton` | Botón con el estilo de la marca | `variante`: `primario`, `secundario`, `oscuro`, `peligro` |
| `Cargando` | Mientras llegan los datos | `texto` (opcional) |
| `MensajeError` | Si un pedido falló | `mensaje` |
| `MensajeVacio` | Si una lista vino vacía | `titulo`, `children` |
| `EnConstruccion` | Marcador de pantalla pendiente (se borra al desarrollarla) | `titulo`, `responsable` |

---

## 5. Cómo se piden los datos (integración)

**Regla de oro: las pantallas nunca usan `fetch` directo.** Llaman a una función de `services/`, y esa función usa `pedir()` de `services/api.js`.

```
Pantalla ──► services/<dominio>Service.js ──► pedir() en services/api.js ──┬── USAR_MOCKS = true  → fetch('/data/products.json')
                                                                           └── USAR_MOCKS = false → fetch('http://localhost:8080/api/productos')
```

- En los dos casos es un `fetch`, así que la pantalla no cambia (es lo que pide la consigna).
- **Para conectar el backend** se pone `USAR_MOCKS = false` en `src/services/api.js`, y listo.
- Si el pedido falla, `pedir()` lanza un `ErrorApi` con `.estado` (código HTTP) y `.message`.

**Cómo escribir un servicio** (cada persona crea el suyo: `productoService.js`, `carritoService.js`, `pedidoService.js`, `usuarioService.js`, `resenaService.js`):

```js
import { pedir } from './api'

// Una función por endpoint: qué JSON local la simula y a qué endpoint va con el backend real.
export const obtenerAlgo = () =>
  pedir({ mock: 'algo.json', ruta: '/api/algo' })

export const crearAlgo = (datos) =>
  pedir({ mock: 'algo.json', ruta: '/api/algo', metodo: 'POST', cuerpo: datos })
```

Los nombres de los archivos JSON, los endpoints y la forma de cada respuesta están en el contrato.

**Patrón para pedir datos en una pantalla:**

```jsx
const [datos, setDatos] = useState([])
const [cargando, setCargando] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  obtenerAlgo()
    .then(setDatos)
    .catch((e) => setError(e.message))
    .finally(() => setCargando(false))
}, []) // [] = una sola vez. Si depende de un parámetro de la URL, va en el arreglo.

if (cargando) return <Cargando />
if (error) return <MensajeError mensaje={error} />
```

**Sesión (convención entre el Login y el resto de la app):**
- Al loguearse, el Login guarda `localStorage.setItem('token', ...)` y `localStorage.setItem('rol', ...)`.
- `api.js` lee `token` para mandarlo en el header `Authorization`.
- `RutaProtegida` mira si hay `token`; `RutaAdmin` mira si `rol` es `'ADMIN'`.
- Al cerrar sesión, se borran las dos claves.

**Ojo con los mocks:** un archivo JSON no cambia cuando hacés un POST. Si agregás algo al carrito, `carrito.json` sigue igual. Para que la pantalla se vea actualizada, actualizá el estado de React con lo que devolvió el servicio.

---

## 6. Cómo trabajamos con Git

1. Antes de empezar: `git checkout main` y `git pull`.
2. Creá una rama por tarea: `git checkout -b pantalla/carrito`.
3. Desarrollá tu pantalla reemplazando el `<EnConstruccion />`.
4. Antes de subir: `npm run lint` y `npm run build` tienen que pasar sin errores.
5. `git push -u origin pantalla/carrito` y abrí un Pull Request a `main`. Nadie sube directo a `main`.
6. La Persona 1 revisa el PR con el checklist de abajo.

---

## 7. Checklist de revisión del PR

- [ ] La pantalla coincide con el mockup y funciona en celular.
- [ ] No hay `fetch` en `pages/` ni en `components/`: todo pasa por `services/` y `pedir()`.
- [ ] Los JSON de `public/data/` tienen exactamente los campos del contrato.
- [ ] No hay URLs escritas a mano: se usan `RUTAS` y las funciones de `rutas.js`.
- [ ] No hay colores, fuentes ni espacios a mano: se usan las variables.
- [ ] La pantalla muestra los estados de cargando, error y vacío.
- [ ] Si un componente se repite en dos pantallas, está en `components/`.
- [ ] `npm run lint` y `npm run build` pasan sin errores.
