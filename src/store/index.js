import { configureStore } from '@reduxjs/toolkit'
import carritoReducer from './slices/carritoSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    carrito: carritoReducer,
    auth: authReducer,
  },
})
