import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { usuarioService } from '../services/usuarioService'

const STORAGE_KEY = 'padel_usuario'

const AuthContext = createContext(null)

function leerUsuarioGuardado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado)

  const guardar = useCallback((user) => {
    setUsuario(user)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } catch {

    }
  }, [])

  const login = useCallback(async (credenciales) => {
    const user = await usuarioService.login(credenciales)
    guardar(user)
    return user
  }, [guardar])

  const register = useCallback(async (datos) => {
    const user = await usuarioService.register(datos)
    guardar(user)
    return user
  }, [guardar])

  const logout = useCallback(() => {
    setUsuario(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* noop */
    }
  }, [])

  const value = useMemo(
    () => ({ usuario, estaAutenticado: !!usuario, login, register, logout }),
    [usuario, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}