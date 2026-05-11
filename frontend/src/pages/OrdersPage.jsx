import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaShoppingBag, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCheckCircle, FaClock, FaReceipt, FaTimes } from 'react-icons/fa'

// ── Checkout Modal ────────────────────────────────────────────────────────────
function CheckoutModal({ cartTotal, onConfirm, onClose, loading }) {
  const { user } = useAuth()
  const [name,  setName]  = useState(user?.name  || '')
  const [email, setEmail] = useState(user?.email || '')
  const [note,  setNote]  = useState('')

  const vat   = parseFloat((cartTotal * 0.05).toFixed(2))
  const total = parseFloat((cartTotal + vat).toFixed(2))

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <h3 className="font-display text-xl font-bold text-dark-900">Confirm Order</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-gray-400 hover:bg-cream-200 transition-all">
            <FaTimes className="text-xs" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">Your Name *</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Full name" className="input-field"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">Email (optional)</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" className="input-field"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">Note (optional)</label>
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              rows={2} placeholder="Special requests, allergies, etc."
              className="input-field resize-none"
            />
          </div>

          <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between text-gray-500 mb-1">
              <span>Subtotal</span><span>AED {cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 mb-2">
              <span>VAT (5%)</span><span>AED {vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-dark-900 border-t border-cream-200 pt-2">
              <span>Total</span><span className="text-teal-600">AED {total.toFixed(2)}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => name.trim() && onConfirm({ customerName: name.trim(), customerEmail: email.trim(), note: note.trim() })}
            disabled={!name.trim() || loading}
            className="btn-teal w-full justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                Placing Order...
              </span>
            ) : 'Place Order'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Cart Section ──────────────────────────────────────────────────────────────
function CartSection({ cart, dispatch, cartTotal, onCheckout }) {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mb-4">
          <FaShoppingBag className="text-gray-300 text-3xl" />
        </div>
        <h3 className="font-display text-xl font-bold text-dark-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-400 text-sm mb-6">Browse our menu and add your favourite items.</p>
        <Link to="/#menu" className="btn-teal text-sm">Browse Menu</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6">
        {cart.map(item => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-2xl border border-cream-200 p-4 flex items-center gap-4"
          >
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              onError={e => { e.currentTarget.style.display = 'none' }} />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-dark-900 text-sm truncate">{item.name}</h4>
              <p className="text-teal-600 font-black text-sm mt-0.5">AED {item.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => item.qty === 1
                  ? dispatch({ type: 'REMOVE', id: item.id })
                  : dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 })
                }
                className="w-7 h-7 rounded-full bg-cream-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-500 transition-all"
              >
                {item.qty === 1 ? <FaTrash className="text-xs" /> : <FaMinus className="text-xs" />}
              </button>
              <span className="font-bold text-dark-900 w-5 text-center text-sm">{item.qty}</span>
              <button
                onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })}
                className="w-7 h-7 rounded-full bg-teal-100 hover:bg-teal-200 flex items-center justify-center text-teal-600 transition-all"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>
            <div className="text-right min-w-[60px]">
              <p className="font-black text-dark-900 text-sm">AED {item.price * item.qty}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-cream-50 border border-cream-200 rounded-2xl p-5 mb-5">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
          <span>AED {cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>VAT (5%)</span>
          <span>AED {(cartTotal * 0.05).toFixed(2)}</span>
        </div>
        <div className="border-t border-cream-200 pt-3 flex justify-between font-black text-dark-900">
          <span>Total</span>
          <span className="text-teal-600 text-lg">AED {(cartTotal * 1.05).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onCheckout}
          className="btn-teal w-full justify-center text-sm"
        >
          <FaCheckCircle /> Place Order
        </motion.button>
        <a href="tel:0337342122" className="btn-primary w-full justify-center text-sm">
          Call to Order: 03 734 2122
        </a>
        <button
          onClick={() => dispatch({ type: 'CLEAR_CART' })}
          className="text-gray-400 text-xs hover:text-red-400 transition-colors text-center"
        >
          Clear cart
        </button>
      </div>
    </div>
  )
}

// ── Order History ─────────────────────────────────────────────────────────────
function OrderHistorySection({ history, dispatch }) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mb-4">
          <FaReceipt className="text-gray-300 text-2xl" />
        </div>
        <h3 className="font-bold text-dark-900 mb-2">No order history yet</h3>
        <p className="text-gray-400 text-sm">Your placed orders will appear here.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {history.map((order) => {
        const dateStr  = order.createdAt || order.placedAt
        const date     = dateStr ? new Date(dateStr) : null
        const formatted = date
          ? date.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          : ''
        const orderId  = order._id || order.id
        const orderTotal = order.total ? Number(order.total) : (order.items || []).reduce((s, i) => s + i.price * i.qty, 0) * 1.05
        return (
          <motion.div
            key={orderId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-card"
          >
            <div className="bg-cream-50 border-b border-cream-200 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaClock className="text-teal-500 text-xs" />
                <span className="text-dark-800 font-bold text-sm">
                  #{String(orderId).slice(-6).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <FaCheckCircle className="text-[10px]" /> {order.status || 'Confirmed'}
                </span>
                {formatted && <span className="text-gray-400 text-xs">{formatted}</span>}
              </div>
            </div>

            <div className="p-4">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-cream-100 last:border-0">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      onError={e => { e.currentTarget.style.display = 'none' }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark-800 text-sm truncate">{item.name}</p>
                    <p className="text-gray-400 text-xs">× {item.qty}</p>
                  </div>
                  <p className="font-bold text-dark-900 text-sm">AED {(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}

              <div className="flex justify-between items-center pt-3 mt-1">
                <span className="text-gray-500 text-sm">{(order.items || []).reduce((s, i) => s + i.qty, 0)} items</span>
                <span className="font-black text-teal-600 text-base">Total: AED {orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {order.items?.some(i => i.id) && (
              <div className="px-4 pb-4">
                <button
                  onClick={() => order.items.forEach(item => dispatch({ type: 'ADD', item }))}
                  className="w-full text-center text-xs font-bold text-teal-600 hover:text-teal-700 border border-teal-200 hover:border-teal-400 py-2 rounded-xl transition-all"
                >
                  + Reorder these items
                </button>
              </div>
            )}
          </motion.div>
        )
      })}

      <button
        onClick={() => { if (window.confirm('Clear all order history?')) dispatch({ type: 'CLEAR_HISTORY' }) }}
        className="text-gray-300 text-xs hover:text-red-400 transition-colors text-center"
      >
        Clear order history
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { cart, history, dispatch, cartCount, cartTotal, placeOrder } = useOrders()
  const [tab, setTab]         = useState('cart')
  const [ordered, setOrdered] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [placing, setPlacing] = useState(false)

  const handlePlaceOrder = async ({ customerName, customerEmail, note }) => {
    setPlacing(true)
    setOrderError(null)
    const result = await placeOrder({ customerName, customerEmail, note })
    setPlacing(false)
    if (result.success) {
      setShowCheckout(false)
      setOrdered(true)
      setTimeout(() => { setOrdered(false); setTab('history') }, 2500)
    } else {
      setOrderError(result.error || 'Failed to place order. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar />

      <main className="flex-1 section-pad">
        <div className="wrap max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="w-10 h-10 bg-white border border-cream-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-teal-500 hover:border-teal-300 transition-all shadow-card">
              <FaArrowLeft className="text-sm" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold text-dark-900">My Orders</h1>
              <p className="text-gray-400 text-sm">Manage your cart and view past orders</p>
            </div>
          </div>

          <AnimatePresence>
            {ordered && (
              <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3"
              >
                <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                <div>
                  <p className="font-bold text-green-800">Order placed successfully!</p>
                  <p className="text-green-600 text-sm">
                    Call <a href="tel:0337342122" className="underline">03 734 2122</a> or
                    WhatsApp <a href="https://wa.me/971564460779" className="underline">056 446 0779</a> to confirm.
                  </p>
                </div>
              </motion.div>
            )}
            {orderError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3"
              >
                <p className="text-red-700 text-sm font-semibold">{orderError}</p>
                <button onClick={() => setOrderError(null)} className="ml-auto text-red-400 hover:text-red-600"><FaTimes /></button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 bg-white border border-cream-200 rounded-2xl p-1.5 mb-6 shadow-card">
            {[
              { id: 'cart',    label: `Cart (${cartCount})`,       icon: FaShoppingBag },
              { id: 'history', label: `History (${history.length})`, icon: FaReceipt },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === t.id ? 'bg-teal-500 text-white shadow-teal' : 'text-gray-400 hover:text-teal-600'
                }`}
              >
                <t.icon className="text-xs" /> {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {tab === 'cart'
                ? <CartSection cart={cart} dispatch={dispatch} cartTotal={cartTotal} onCheckout={() => setShowCheckout(true)} />
                : <OrderHistorySection history={history} dispatch={dispatch} />
              }
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal
            cartTotal={cartTotal}
            onConfirm={handlePlaceOrder}
            onClose={() => !placing && setShowCheckout(false)}
            loading={placing}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
