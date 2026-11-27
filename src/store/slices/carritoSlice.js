import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as carritoService from '../../services/carritoService'
import { normalizarItem } from '../../utils/carrito'


const initialState = {
  items: [],
  cargando: false,
  error: null
}


export const obtenerCarritoThunk = createAsyncThunk(
  'carrito/obtenerCarrito',
  async (usuarioId, { getState, rejectWithValue }) => {
    const epochInicial = getState().auth.sessionEpoch
    try {
      const data = await carritoService.obtenerCarrito(usuarioId)
      if (getState().auth.sessionEpoch !== epochInicial) {
        return rejectWithValue('Sesión cambiada')
      }
      return Array.isArray(data) ? data : []
    } catch (error) {
      return rejectWithValue(error.message || 'Error al obtener el carrito')
    }
  }
)

export const agregarItemThunk = createAsyncThunk(
  'carrito/agregarItem',
  async ({ usuarioId, producto, cantidad = 1 }, { getState, rejectWithValue }) => {
    const epochInicial = getState().auth.sessionEpoch
    try {
      let itemCreado = null
      if (usuarioId) {
        itemCreado = await carritoService.agregarItem(
          usuarioId,
          producto.id,
          cantidad,
          producto.precio
        )
      }
      if (getState().auth.sessionEpoch !== epochInicial) {
        return rejectWithValue('Sesión cambiada')
      }
      return { producto, cantidad, itemCreado }
    } catch (error) {
      return rejectWithValue(error.message || 'Error al agregar producto')
    }
  }
)

export const modificarCantidadThunk = createAsyncThunk(
  'carrito/modificarCantidad',
  async ({ itemId, cantidad, productoId }, { getState, rejectWithValue }) => {
    const epochInicial = getState().auth.sessionEpoch
    try {
      await carritoService.modificarCantidad(itemId, cantidad)
      if (getState().auth.sessionEpoch !== epochInicial) {
        return rejectWithValue('Sesión cambiada')
      }
      return { productoId, cantidad }
    } catch (error) {
      return rejectWithValue(error.message || 'Error al actualizar cantidad')
    }
  }
)

export const quitarProductoThunk = createAsyncThunk(
  'carrito/quitarProducto',
  async ({ usuarioId, productoId }, { getState, rejectWithValue }) => {
    const epochInicial = getState().auth.sessionEpoch
    try {
      if (usuarioId) {
        await carritoService.quitarProducto(usuarioId, productoId)
      }
      if (getState().auth.sessionEpoch !== epochInicial) {
        return rejectWithValue('Sesión cambiada')
      }
      return productoId
    } catch (error) {
      return rejectWithValue(error.message || 'Error al eliminar producto')
    }
  }
)

export const vaciarCarritoThunk = createAsyncThunk(
  'carrito/vaciarCarrito',
  async (usuarioId, { getState, rejectWithValue }) => {
    const epochInicial = getState().auth.sessionEpoch
    try {
      if (usuarioId) {
        await carritoService.limpiarCarrito(usuarioId)
      }
      if (getState().auth.sessionEpoch !== epochInicial) {
        return rejectWithValue('Sesión cambiada')
      }
      return []
    } catch (error) {
      return rejectWithValue(error.message || 'Error al vaciar carrito')
    }
  }
)


const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    limpiarEstadoCarrito: (state) => {
      state.items = []
      state.error = null
      state.cargando = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(obtenerCarritoThunk.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(obtenerCarritoThunk.fulfilled, (state, action) => {
        state.cargando = false
        state.items = action.payload.map(normalizarItem)
      })
      .addCase(obtenerCarritoThunk.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      .addCase(agregarItemThunk.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(agregarItemThunk.fulfilled, (state, action) => {
        state.cargando = false
        const { producto, cantidad, itemCreado } = action.payload
        const existente = state.items.find(
          (item) => item.productoId === producto.id
        )

        if (existente) {
          existente.cantidad += cantidad
          if (itemCreado?.id) {
            existente.id = itemCreado.id
          }
        } else {
          state.items.push(
            normalizarItem({
              id: itemCreado?.id ?? producto.id,
              productoId: producto.id,
              productoNombre: producto.nombre,
              cantidad,
              precioUnitario: producto.precio,
              imagenUrl: producto.imagenUrl,
              stock: producto.stock
            })
          )
        }
      })
      .addCase(agregarItemThunk.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      .addCase(modificarCantidadThunk.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(modificarCantidadThunk.fulfilled, (state, action) => {
        state.cargando = false
        const { productoId, cantidad } = action.payload
        const item = state.items.find((i) => i.productoId === productoId)
        if (item) {
          item.cantidad = cantidad
        }
      })
      .addCase(modificarCantidadThunk.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      .addCase(quitarProductoThunk.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(quitarProductoThunk.fulfilled, (state, action) => {
        state.cargando = false
        state.items = state.items.filter(
          (item) => item.productoId !== action.payload
        )
      })
      .addCase(quitarProductoThunk.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })

      .addCase(vaciarCarritoThunk.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(vaciarCarritoThunk.fulfilled, (state) => {
        state.cargando = false
        state.items = []
      })
      .addCase(vaciarCarritoThunk.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload
      })
  }
})


export const { limpiarEstadoCarrito } = carritoSlice.actions
export default carritoSlice.reducer
