import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaFilter, FaEye, FaTimes, FaDownload, FaSpinner } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'

const adminFetch = (path, options = {}) => {
  const token = localStorage.getItem('ch_admin_token')
  return fetch(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers },
  })
}

const statuses   = ['All', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled']
const nextStatus = { Confirmed: 'Preparing', Preparing: 'Delivered' }

const statusStyle = {
  Delivered:  'bg-green-100 text-green-700 border-green-200',
  Preparing:  'bg-amber-100 text-amber-700 border-amber-200',
  Confirmed:  'bg-blue-100  text-blue-700  border-blue-200',
  Cancelled:  'bg-red-100   text-red-600   border-red-200',
}

function OrderDetail({ order, onClose, onUpdateStatus }) {
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async (newStatus) => {
    setUpdating(true)
    await onUpdateStatus(order._id, newStatus)
    setUpdating(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900">#{order._id.slice(-8).toUpperCase()}</h3>
            <p className="text-slate-500 text-xs">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-300 transition-all">
            <FaTimes className="text-xs" />
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 font-semibold uppercase mb-2">Customer</p>
            <p className="font-bold text-slate-900">{order.customerName}</p>
            <p className="text-slate-500 text-sm">{order.customerEmail}</p>
            {order.note && <p className="text-slate-400 text-xs mt-1 italic">Note: {order.note}</p>}
          </div>

          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase mb-2">Order Items</p>
            <div className="flex flex-col gap-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{item.name} <span className="text-slate-400">× {item.qty}</span></span>
                  <span className="font-semibold text-slate-800">AED {(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-2 space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span><span>AED {order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>VAT (5%)</span><span>AED {order.vat?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900">
                  <span>Total</span><span className="text-teal-600">AED {order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusStyle[order.status]}`}>
              {order.status}
            </span>
            {nextStatus[order.status] && (
              <button
                onClick={() => handleUpdate(nextStatus[order.status])}
                disabled={updating}
                className="bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2"
              >
                {updating && <FaSpinner className="animate-spin text-[10px]" />}
                Mark as {nextStatus[order.status]}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminOrders() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)

  const fetchOrders = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter !== 'All') params.set('status', filter)
    if (search) params.set('search', search)
    adminFetch(`/api/admin/orders?${params}`)
      .then(r => r.json())
      .then(d => setOrders(d.orders || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [filter, search])

  const updateStatus = async (id, newStatus) => {
    const res  = await adminFetch(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    })
    const data = await res.json()
    if (res.ok) {
      setOrders(prev => prev.map(o => o._id === id ? data.order : o))
    }
  }

  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === 'All' ? orders.length : orders.filter(o => o.status === s).length
    return acc
  }, {})

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-slate-900 text-2xl font-black">Orders</h1>
            <p className="text-slate-500 text-sm">{orders.length} orders found</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by customer name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                  filter === s ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                }`}
              >
                {s} <span className="opacity-60 ml-1">({counts[s]})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-4 border-teal-200 border-t-teal-500 rounded-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left border-b border-slate-100">
                    {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Action'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-slate-500 text-xs font-bold uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {orders.map((order, i) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-teal-600 font-bold text-xs whitespace-nowrap">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-slate-800 font-semibold text-xs">{order.customerName}</p>
                          <p className="text-slate-400 text-[10px]">{order.customerEmail}</p>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs max-w-[160px] truncate">
                          {order.items.map(it => it.name).join(', ')}
                        </td>
                        <td className="px-5 py-3.5 text-slate-800 font-bold text-xs whitespace-nowrap">AED {order.total?.toFixed(2)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusStyle[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelected(order)}
                              className="w-7 h-7 bg-slate-100 hover:bg-teal-100 hover:text-teal-600 rounded-lg flex items-center justify-center text-slate-500 transition-all"
                            >
                              <FaEye className="text-xs" />
                            </button>
                            {nextStatus[order.status] && (
                              <button
                                onClick={() => updateStatus(order._id, nextStatus[order.status])}
                                className="text-[10px] font-bold px-2.5 py-1 bg-teal-50 hover:bg-teal-500 text-teal-600 hover:text-white rounded-lg border border-teal-200 hover:border-teal-500 transition-all whitespace-nowrap"
                              >
                                → {nextStatus[order.status]}
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <FaFilter className="text-3xl mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No orders found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <OrderDetail
            order={selected}
            onClose={() => setSelected(null)}
            onUpdateStatus={async (id, s) => { await updateStatus(id, s) }}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
