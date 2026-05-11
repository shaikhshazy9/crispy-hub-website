import { createContext, useContext, useReducer, useEffect } from 'react'

const OrderContext = createContext(null)

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.cart.find(i => i.id === action.item.id)
      const cart = exists
        ? state.cart.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.cart, { ...action.item, qty: 1 }]
      return { ...state, cart }
    }
    case 'REMOVE':
      return { ...state, cart: state.cart.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY':
      return {
        ...state,
        cart: state.cart.map(i => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i),
      }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'CLEAR_HISTORY':
      return { ...state, history: [] }
    case 'ORDER_PLACED': {
      return { cart: [], history: [action.order, ...state.history] }
    }
    default:
      return state
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    cart:    load('ch_cart', []),
    history: load('ch_orders', []),
  }))

  useEffect(() => { localStorage.setItem('ch_cart',   JSON.stringify(state.cart)) },    [state.cart])
  useEffect(() => { localStorage.setItem('ch_orders', JSON.stringify(state.history)) }, [state.history])

  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0)

  // ── Place order — saves to backend + updates local state ──────────────────
  const placeOrder = async ({ customerName, customerEmail, note } = {}) => {
    if (state.cart.length === 0) return { success: false, error: 'Cart is empty.' }

    const token = localStorage.getItem('ch_token')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: state.cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
          customerName: customerName || 'Guest',
          customerEmail: customerEmail || '',
          note: note || '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Order failed.')

      dispatch({ type: 'ORDER_PLACED', order: data.order })
      return { success: true, order: data.order }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return (
    <OrderContext.Provider value={{ ...state, dispatch, cartCount, cartTotal, placeOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = () => useContext(OrderContext)
