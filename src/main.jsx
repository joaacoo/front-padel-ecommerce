import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import './styles/variables.css'
import './styles/global.css'
import './styles/auth.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

/*
 * Punto de entrada.
 * Provider: expone el Store de Redux a toda la aplicación.
 * BrowserRouter: habilita la navegación de la SPA (cambia la URL sin recargar la página).
 * AuthProvider: guarda la sesión del usuario y la comparte con toda la app.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
