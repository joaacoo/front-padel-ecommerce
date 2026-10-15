
import { createContext, useContext, useState, useEffect } from 'react'

const CarritoContext = createContext(null)

export function CarritoProvider({ children }) {

  // Recuperar el carrito guardado en localStorage
  const [items, setItems] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem('carrito')
      const datos = carritoGuardado ? JSON.parse(carritoGuardado) : []
      return Array.isArray(datos) ? datos : []
    } catch {
      return []
    }
  })

  // Guardar el carrito cada vez que cambia
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items))
  }, [items])

  // Agregar un producto al carrito
  const agregarProducto = (producto, cantidad = 1) => {
    if (!Number.isInteger(cantidad) || cantidad <= 0) return false

    const existente = items.find(
      (item) => item.productoId === producto.id
    )

    const cantidadActual = existente?.cantidad ?? 0

    if (cantidadActual + cantidad > producto.stock) {
      return false
    }

    setItems((anteriores) => {
      const encontrado = anteriores.find(
        (item) => item.productoId === producto.id
      )

      if (encontrado) {
        return anteriores.map((item) =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      }

      return [
        ...anteriores,
        {
          id: producto.id,
          productoId: producto.id,
          productoNombre: producto.nombre,
          cantidad,
          precioUnitario: producto.precio,
          imagenUrl: producto.imagenUrl,
          stock: producto.stock
        }
      ]
    })

    return true
  }

  // Modificar la cantidad de un producto
  const actualizarCantidad = (productoId, nuevaCantidad) => {
    setItems((anteriores) =>
      anteriores.map((item) => {
        if (item.productoId !== productoId) return item

        if (
          !Number.isInteger(nuevaCantidad) ||
          nuevaCantidad < 1 ||
          nuevaCantidad > item.stock
        ) {
          return item
        }

        return { ...item, cantidad: nuevaCantidad }
      })
    )
  }

  // Eliminar un producto del carrito
  const eliminarProducto = (productoId) => {
    setItems((anteriores) =>
      anteriores.filter(
        (item) => item.productoId !== productoId
      )
    )
  }

  // Vaciar el carrito completamente
  const vaciarCarrito = () => {
    setItems([])
  }

  // Calcular la cantidad total de unidades
  const cantidadTotal = items.reduce(
    (total, item) => total + item.cantidad,
    0
  )

  // Calcular el precio total del carrito
  const total = items.reduce(
    (acumulado, item) =>
      acumulado + item.precioUnitario * item.cantidad,
    0
  )

  // Compartir los datos y funciones con los componentes
  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarProducto,
        actualizarCantidad,
        eliminarProducto,
        vaciarCarrito,
        cantidadTotal,
        total
      }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

// Hook para acceder al carrito desde otros componentes
export function useCarrito() {
  const contexto = useContext(CarritoContext)

  if (!contexto) {
    throw new Error(
      'useCarrito debe utilizarse dentro de CarritoProvider'
    )
  }

  return contexto
}
