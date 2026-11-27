import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { usuarioService } from '../../services/usuarioService'
import { limpiarEstadoCarrito } from './carritoSlice'

function limpiarClavesAuthLocalStorage() {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('padel_usuario')
    localStorage.removeItem('rol')
  } catch {
    /* noop */
  }
}

const initialState = {
  usuario: null,
  estaAutenticado: false,
  cargando: false,
  error: null,
  sesionVerificada: false,
  sessionEpoch: 0,
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credenciales, { rejectWithValue }) => {
    try {
      const usuario = await usuarioService.login(credenciales)
      limpiarClavesAuthLocalStorage()
      return usuario
    } catch (error) {
      return rejectWithValue(error.message || 'Error al iniciar sesión')
    }
  }
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (datos, { rejectWithValue }) => {
    try {
      return await usuarioService.register(datos)
    } catch (error) {
      return rejectWithValue(error.message || 'Error al registrar usuario')
    }
  }
)

export const verificarSesionThunk = createAsyncThunk(
  'auth/verificarSesion',
  async (_, { rejectWithValue }) => {
    try {
      const usuario = await usuarioService.me()
      limpiarClavesAuthLocalStorage()
      return usuario
    } catch (error) {
      limpiarClavesAuthLocalStorage()
      return rejectWithValue(error.message || 'Sesión no válida')
    }
  }
)

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await usuarioService.logout()
      limpiarClavesAuthLocalStorage()
      dispatch(limpiarEstadoCarrito())
      return null
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cerrar sesión')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    limpiarErrorAuth: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.cargando = false
        state.usuario = action.payload
        state.estaAutenticado = true
        state.sesionVerificada = true
        state.sessionEpoch += 1
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      .addCase(registerThunk.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.cargando = false
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      .addCase(verificarSesionThunk.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(verificarSesionThunk.fulfilled, (state, action) => {
        state.cargando = false
        state.usuario = action.payload
        state.estaAutenticado = true
        state.sesionVerificada = true
        state.sessionEpoch += 1
      })
      .addCase(verificarSesionThunk.rejected, (state) => {
        state.cargando = false
        state.usuario = null
        state.estaAutenticado = false
        state.sesionVerificada = true
      })

      .addCase(logoutThunk.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.cargando = false
        state.usuario = null
        state.estaAutenticado = false
        state.sesionVerificada = true
        state.sessionEpoch += 1
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })
  },
})

export const { limpiarErrorAuth } = authSlice.actions
export default authSlice.reducer
