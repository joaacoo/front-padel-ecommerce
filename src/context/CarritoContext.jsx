import { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from './AuthContext'
import {
  obtenerCarritoThunk,
  agregarItemThunk,
  modificarCantidadThunk,
  quitarProductoThunk,
  vaciarCarritoThunk
} from '../store/slices/carritoSlice'

export function useCarrito() {
  const dispatch = useDispatch()
  const { usuario } = useAuth()
  const { items, cargando, error } = useSelector((state) => state.carrito)

  // Sincronizar el carrito desde el backend al cambiar el usuario logueado
  useEffect(() => {
    if (usuario?.id) {
      dispatch(obtenerCarritoThunk(usuario.id))
    }
  }, [dispatch, usuario?.id])

  const agregarProducto = useCallback(
    (producto, cantidad = 1) => {
      if (!Number.isInteger(cantidad) || cantidad <= 0) return false

      const existente = items.find((item) => item.productoId === producto.id)
      const cantidadActual = existente?.cantidad ?? 0

      if (cantidadActual + cantidad > producto.stock) {
        return false
      }

      dispatch(
        agregarItemThunk({
          usuarioId: usuario?.id,
          producto,
          cantidad
        })
      )
      return true
    },
    [dispatch, items, usuario?.id]
  )

  const actualizarCantidad = useCallback(
    (productoId, nuevaCantidad) => {
      const item = items.find((i) => i.productoId === productoId)
      if (!item) return

      if (
        !Number.isInteger(nuevaCantidad) ||
        nuevaCantidad < 1 ||
        nuevaCantidad > item.stock
      ) {
        return
      }

      dispatch(
        modificarCantidadThunk({
          itemId: item.id,
          cantidad: nuevaCantidad,
          productoId
        })
      )
    },
    [dispatch, items]
  )

  const eliminarProducto = useCallback(
    (productoId) => {
      dispatch(
        quitarProductoThunk({
          usuarioId: usuario?.id,
          productoId
        })
      )
    },
    [dispatch, usuario?.id]
  )

  const vaciarCarrito = useCallback(() => {
    dispatch(vaciarCarritoThunk(usuario?.id))
  }, [dispatch, usuario?.id])

  const cantidadTotal = useMemo(
    () => items.reduce((total, item) => total + item.cantidad, 0),
    [items]
  )

  const total = useMemo(
    () =>
      items.reduce(
        (acumulado, item) => acumulado + item.precioUnitario * item.cantidad,
        0
      ),
    [items]
  )

  return {
    items,
    cargando,
    error,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    cantidadTotal,
    total
  }
}
