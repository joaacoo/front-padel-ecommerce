import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as carritoService from '../../services/carritoService'

// Helper para normalizar items que vengan del backend (ItemCarritoResponse) o mock
const normalizarItem = (item) => ({
  id: item.id || item.productoId,
  productoId: item.productoId ?? item.producto?.id ?? item.id,
  productoNombre: item.productoNombre ?? item.producto?.nombre ?? item.nombre,
  cantidad: item.cantidad,
  precioUnitario: item.precioUnitario ?? item.producto?.precio ?? item.precio,
  imagenUrl: item.imagenUrl ?? item.producto?.imagenUrl ?? '',
  stock: item.stock ?? item.producto?.stock ?? 999
})

// Thunk para obtener el carrito del usuario logueado
export const obtenerCarritoThunk = createAsyncThunk(
  'carrito/obtenerCarrito',
  async (usuarioId, { rejectWithValue }) => {
    try {
      const data = await carritoService.obtenerCarrito(usuarioId)
      return Array.isArray(data) ? data : []
    } catch (error) {
      return rejectWithValue(error.message || 'Error al obtener el carrito')
    }
  }
)

// Thunk para agregar producto (impacta en backend)
export const agregarItemThunk = createAsyncThunk(
  'carrito/agregarItem',
  async ({ usuarioId, producto, cantidad = 1 }, { rejectWithValue }) => {
    try {
      // Si hay un usuario logueado, impactamos en el backend
      if (usuarioId) {
        await carritoService.agregarItem(
          usuarioId,
          producto.id,
          cantidad,
          producto.precio
        )
      }
      return { producto, cantidad }
    } catch (error) {
      return rejectWithValue(error.message || 'Error al agregar producto')
    }
  }
)

// Thunk para actualizar cantidad (impacta en backend)
export const modificarCantidadThunk = createAsyncThunk(
  'carrito/modificarCantidad',
  async ({ itemId, cantidad, productoId }, { rejectWithValue }) => {
    try {
      await carritoService.modificarCantidad(itemId, cantidad)
      return { productoId, cantidad }
    } catch (error) {
      return rejectWithValue(error.message || 'Error al actualizar cantidad')
    }
  }
)

// Thunk para eliminar producto (impacta en backend)
export const quitarProductoThunk = createAsyncThunk(
  'carrito/quitarProducto',
  async ({ usuarioId, productoId }, { rejectWithValue }) => {
    try {
      if (usuarioId) {
        await carritoService.quitarProducto(usuarioId, productoId)
      }
      return productoId
    } catch (error) {
      return rejectWithValue(error.message || 'Error al eliminar producto')
    }
  }
)

// Thunk para vaciar carrito (impacta en backend)
export const vaciarCarritoThunk = createAsyncThunk(
  'carrito/vaciarCarrito',
  async (usuarioId, { rejectWithValue }) => {
    try {
      if (usuarioId) {
        await carritoService.limpiarCarrito(usuarioId)
      }
      return []
    } catch (error) {
      return rejectWithValue(error.message || 'Error al vaciar carrito')
    }
  }
)

const initialState = {
  items: [],
  cargando: false,
  error: null
}

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
      // obtenerCarritoThunk
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

      // agregarItemThunk
      .addCase(agregarItemThunk.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(agregarItemThunk.fulfilled, (state, action) => {
        state.cargando = false
        const { producto, cantidad } = action.payload
        const existente = state.items.find(
          (item) => item.productoId === producto.id
        )

        if (existente) {
          existente.cantidad += cantidad
        } else {
          state.items.push(
            normalizarItem({
              id: producto.id,
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

      // modificarCantidadThunk
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

      // quitarProductoThunk
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

      // vaciarCarritoThunk
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
