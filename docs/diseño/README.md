# Diseño

Todas las pantallas del front, exportadas en PNG y numeradas en el orden en que las recorre un usuario.

- `mockups/`: diseño final, con colores, tipografía e íconos.
- `wireframes/`: la misma pantalla en gris, solo estructura (qué va y dónde).
- `wireflow.png`: cómo se navega de una pantalla a otra. La versión editable está en [`docs/wireflow.md`](../wireflow.md).

| # | Pantalla | Ruta | Acceso |
|---|---|---|---|
| 01 | Login | `/login` | Pública |
| 02 | Registro | `/registro` | Pública |
| 03 | Home (listado de productos) | `/` | Login |
| 04 | Catálogo por categoría | `/` filtrado (lo define la Persona 2) | Login |
| 05 | Detalle de producto + reseñas | `/producto/:id` | Login |
| 06 | Detalle sin stock | `/producto/:id` con stock 0 | Login |
| 07 | Carrito | `/carrito` | Login |
| 08 | Checkout | `/checkout` | Login |
| 09 | Pedido confirmado | `/checkout` (después de confirmar) | Login |
| 10 | Mis pedidos | `/mis-pedidos` | Login |
| 11 | Mi perfil | `/perfil` | Login |
| 12 | Mis productos | `/admin/productos` | ADMIN |
| 13 | Publicar / editar producto | `/admin/productos/nuevo` · `/admin/productos/:id/editar` | ADMIN |
