# Wireflow — mapa de navegación

Cómo se pasa de una pantalla a otra. Los colores marcan quién puede entrar:

- **Gris:** pública (sin login)
- **Azul:** necesita login (rol USER o ADMIN)
- **Negro:** solo ADMIN

Diseño de cada pantalla: [`docs/diseño/mockups/`](diseño/mockups/). Este mismo mapa en imagen: [`docs/diseño/wireflow.png`](diseño/wireflow.png).

```mermaid
flowchart LR
    Login["Login<br>/login"]
    Registro["Registro<br>/registro"]
    Lista["Listado de productos<br>/"]
    Detalle["Detalle + reseñas<br>/producto/:id"]
    Carrito["Carrito<br>/carrito"]
    Checkout["Checkout<br>/checkout"]
    Confirmado(["Pedido confirmado<br>(misma pantalla de Checkout)"])
    Pedidos["Mis pedidos<br>/mis-pedidos"]
    Perfil["Mi perfil<br>/perfil"]
    MisProductos["Mis productos<br>/admin/productos"]
    Publicar["Publicar / editar<br>/admin/productos/nuevo<br>/admin/productos/:id/editar"]

    Login -- "¿No tenés cuenta?" --> Registro
    Registro -- "Cuenta creada (201)" --> Login
    Login -- "Login correcto" --> Lista

    Lista -- "Categoría o búsqueda (Persona 2)" --> Lista
    Lista -- "Tocar producto" --> Detalle
    Detalle -- "Agregar al carrito" --> Carrito
    Detalle -- "Publicar reseña" --> Detalle
    Carrito -- "Ir al checkout" --> Checkout
    Checkout -- "Confirmar (201)" --> Confirmado
    Confirmado -- "Volver al inicio" --> Lista

    Lista -- "Mis pedidos" --> Pedidos
    Lista -- "Mi perfil" --> Perfil
    Perfil -- "Mis pedidos" --> Pedidos

    Lista -- "Mis productos (admin)" --> MisProductos
    MisProductos -- "Publicar / Editar" --> Publicar
    Publicar -- "Guardar" --> MisProductos

    classDef publica fill:#E2E4E9,stroke:#5E6470,color:#0B0D10
    classDef login fill:#1E5AE8,stroke:#1747BA,color:#FFFFFF
    classDef admin fill:#0B0D10,stroke:#0B0D10,color:#FFFFFF
    class Login,Registro publica
    class Lista,Detalle,Carrito,Checkout,Confirmado,Pedidos,Perfil login
    class MisProductos,Publicar admin
```

## Desde cualquier pantalla con login

El encabezado (`Navbar`) está en todas, así que desde cualquiera se puede ir a: listado (logo), el carrito, Mi perfil, Mis pedidos, Mis productos (solo admin) y Cerrar sesión (→ Login).

## Reglas de redirección

| Situación | Qué pasa | Dónde está |
|---|---|---|
| Entra a una pantalla con login sin estar logueado | Va a Login; después de ingresar, vuelve a la pantalla que quería | `src/routes/RutaProtegida.jsx` |
| Un USER entra a `/admin/...` | Va al listado de productos | `src/routes/RutaAdmin.jsx` |
| La URL no existe | Pantalla "Esta página no existe" | `src/pages/NoEncontrada` |

Mientras no esté el Login, las rutas dejan pasar a todos (`PROTEGER_RUTAS = false` en `src/routes/rutas.js`), así cada uno puede probar su pantalla.

La búsqueda y los filtros por categoría están en el mockup, pero cómo se implementan (y si usan parámetros en la URL) lo decide la Persona 2.
