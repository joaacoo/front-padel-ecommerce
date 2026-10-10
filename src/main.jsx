import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/variables.css'
import './styles/global.css'
import './styles/auth.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

/*
 * Punto de entrada.
 * BrowserRouter: habilita la navegación de la SPA (cambia la URL sin recargar la página).
 * AuthProvider: guarda la sesión del usuario y la comparte con toda la app (Persona 5).
 * AuthProvider va adentro de BrowserRouter para que la sesión pueda usar la navegación.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
