import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import AuthStatus from './components/AuthStatus'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid var(--border)' }}>
        <Link to="/">Padel E-commerce</Link>
        <AuthStatus />
      </header>
      <Routes>
        <Route path="/" element={<main className="auth-page"><h1>Inicio</h1></main>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App