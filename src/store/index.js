import { configureStore } from '@reduxjs/toolkit'
import carritoReducer from './slices/carritoSlice'

export const store = configureStore({
  reducer: {
    carrito: carritoReducer
  }
})


