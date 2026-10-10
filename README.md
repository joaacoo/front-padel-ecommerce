# Punto de Oro — Frontend

Frontend del e-commerce de pádel (TPO de Aplicaciones Interactivas, UADE).
React + Vite + react-router-dom. El backend está en [padel-ecommerce](https://github.com/joaacoo/padel-ecommerce).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí http://localhost:5173. La app lee datos locales de `public/data/`, así que no hace falta levantar el backend.
Para usar el backend real: en `src/services/api.js`, cambiá `USAR_MOCKS` a `false`.

## Documentación

Leela antes de empezar tu pantalla:

- [Guía del frontend](docs/guia-frontend.md): quién hace qué, carpetas, rutas, componentes, cómo pedir datos y checklist de PR.
- [Contrato de datos](docs/contrato-api.md): la forma exacta de cada JSON y qué archivo crea cada uno.
- [Wireflow](docs/wireflow.md): mapa de navegación.
- [Diseño](docs/diseño/): mockups, wireframes y wireflow en PNG.

## Estado de las pantallas

| Pantalla | Responsable | Estado |
|---|---|---|
| Listado y búsqueda (ProductList) | Persona 2 | ⏳ Pendiente |
| Detalle (ProductDetail) y Carrito | Persona 3 | ⏳ Pendiente |
| Checkout, confirmación y Mis pedidos | Persona 4 | ⏳ Pendiente |
| Login, Registro y Perfil | Persona 5 | ⏳ Pendiente |
| Reseñas (ResenaList) | Persona 6 | ⏳ Pendiente |
| Gestión de productos (admin) | Sin asignar | ⏳ Pendiente |
