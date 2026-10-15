import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const dataUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
async function cargarServicio(mocks) {
  const api = dataUrl((await readFile(new URL('../src/services/api.js', import.meta.url), 'utf8')).replace('export const USAR_MOCKS = true', `export const USAR_MOCKS = ${mocks}`))
  const carrito = dataUrl((await readFile(new URL('../src/services/carritoService.js', import.meta.url), 'utf8')).replace("'./api'", JSON.stringify(api)))
  const servicio = (await readFile(new URL('../src/services/pedidoService.js', import.meta.url), 'utf8'))
    .replace("'./api'", JSON.stringify(api)).replace("'./carritoService'", JSON.stringify(carrito))
  return import(dataUrl(servicio))
}
const mock = await cargarServicio(true)
const real = await cargarServicio(false)
const items = [{ productoId: 3, productoNombre: 'Paleta', cantidad: 2, precioUnitario: 100, stock: 5 }]
const respuesta = (datos, status = 200) => new Response(JSON.stringify(datos), { status })

beforeEach(() => {
  const datos = new Map()
  globalThis.localStorage = { getItem: (key) => datos.get(key) ?? null, setItem: (key, value) => datos.set(key, value) }
  globalThis.fetch = async (url) => respuesta(JSON.parse(await readFile(new URL(`../public${url}`, import.meta.url), 'utf8')))
})

test('mock: crea DTO, calcula total y conserva historial separado por usuario', async () => {
  assert.deepEqual(await mock.obtenerPedidos(1), [])
  const primero = await mock.crearPedido(1, items)
  const segundo = await mock.crearPedido(1, items)
  assert.deepEqual(Object.keys(primero).sort(), ['fecha', 'id', 'total'])
  assert.equal(primero.total, 200)
  assert.notEqual(primero.id, segundo.id)
  assert.equal((await mock.obtenerPedidos(1)).length, 2)
  assert.deepEqual(await mock.obtenerPedidos(2), [])
})

test('rechaza usuario ausente, carrito vacío y cantidades inválidas antes de llamar a la API', async () => {
  globalThis.fetch = () => assert.fail('No debe enviar solicitudes')
  await assert.rejects(real.crearPedido(undefined, items), /sesión/)
  await assert.rejects(real.crearPedido(1, []), /vacío/)
  await assert.rejects(real.crearPedido(1, [{ ...items[0], cantidad: 6 }]), /disponibilidad/)
})

test('API: sincroniza diferencias, envía solo usuarioId y conserva el total del backend', async () => {
  const llamadas = []
  localStorage.setItem('token', 'token-prueba')
  globalThis.fetch = async (url, options) => {
    llamadas.push({ url, ...options })
    if (options.method === 'GET') return respuesta([
      { id: 10, productoId: 3, cantidad: 1 }, { id: 11, productoId: 9, cantidad: 1 },
    ])
    if (options.method === 'DELETE') return new Response(null, { status: 204 })
    return respuesta({ id: 52, fecha: '2026-10-15T12:00:00', total: 180 })
  }
  const pedido = await real.crearPedido(1, items)
  assert.equal(pedido.total, 180)
  assert.deepEqual(llamadas.map((call) => call.method), ['GET', 'DELETE', 'PUT', 'POST'])
  assert.deepEqual(JSON.parse(llamadas[2].body), { cantidad: 2 })
  assert.deepEqual(JSON.parse(llamadas[3].body), { usuarioId: 1 })
  assert.equal(llamadas[3].headers.Authorization, 'Bearer token-prueba')
  assert.equal(llamadas[3].url, 'http://localhost:8080/api/pedidos')
})

test('API: un error de sincronización impide crear el pedido', async () => {
  const metodos = []
  globalThis.fetch = async (url, options) => {
    metodos.push(options.method)
    if (options.method === 'GET') return respuesta([])
    return respuesta({ error: 'Stock insuficiente' }, 400)
  }
  await assert.rejects(real.crearPedido(1, items), /Stock insuficiente/)
  assert.deepEqual(metodos, ['GET', 'POST'])
})

test('API: propaga rechazo del pedido sin modificar los productos locales', async () => {
  globalThis.fetch = async (url, options) => options.method === 'GET'
    ? respuesta([{ id: 10, productoId: 3, cantidad: 2 }])
    : respuesta({ error: 'Stock insuficiente' }, 400)
  const copia = structuredClone(items)
  await assert.rejects(real.crearPedido(1, items), /Stock insuficiente/)
  assert.deepEqual(items, copia)
})
