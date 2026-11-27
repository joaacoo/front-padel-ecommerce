import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import './styles/variables.css'
import './styles/global.css'
import './styles/auth.css'
import App from './App.jsx'

/*
 * Punto de entrada.
 * Provider: expone el Store de Redux a toda la aplicación.
 * BrowserRouter: habilita la navegación de la SPA (cambia la URL sin recargar la página).
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
