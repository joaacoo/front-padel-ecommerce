import EnConstruccion from '../../components/ui/EnConstruccion'

/*
 * PERSONA 5 — Login
 * Ruta: /login (pública, sin encabezado) · Mockup: docs/diseño/mockups/01-login.png · Contrato: sección 3 (Acceso)
 * Convención con las rutas: guardar localStorage 'token' y 'rol', y después poner
 * PROTEGER_RUTAS = true en src/routes/rutas.js (ver docs/guia-frontend.md, sección 5).
 *
 * Esta pantalla es de quien figura como responsable: este archivo es solo un marcador
 * para que el router compile. Se reemplaza entero por la pantalla real.
 */
export default function Login() {
  return <EnConstruccion titulo="Iniciar sesión" responsable="Persona 5" />
}
