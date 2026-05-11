import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaShoppingBag, FaUsers, FaEnvelope, FaMoneyBillWave, FaClock, FaCheckCircle, FaFire } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'

const adminFetch = (path, options = {}) => {
  const token = localStorage.getItem('ch_admin_token')
  return fetch(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers },
  })
}

const statusStyle = {
  Delivered:  'bg-green-100 text-green-700',
  Preparing:  'bg-amber-100 text-amber-700',
  Confirmed:  'bg-blue-100 text-blue-700',
  Cancelled:  'bg-red-100 text-red-600',
}

const statusOptions = ['Confirmed', 'Preparing', 'Delivered', 'Cancelled']

function StatusDropdown({ orderId, current, onChange }) {
  const [value, setValue]     = useState(current)
  const [saving, setSaving]   = useState(false)

  const handle = async (e) => {
    const newStatus = e.target.value
    setSaving(true)
    const res = await adminFetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setValue(newStatus)
      onChange(orderId, newStatus)
    }
    setSaving(false)
  }

  const colors = {
    Confirmed: 'border-blue-300  bg-blue-50  text-blue-700',
    Preparing: 'border-amber-300 bg-amber-50 text-amber-700',
    Delivered: 'border-green-300 bg-green-50 text-green-700',
    Cancelled: 'border-red-300   bg-red-50   text-red-600',
  }

  return (
    <select
      value={value}
      onChange={handle}
      disabled={saving}
      className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer outline-none transition-all disabled:opacity-60 ${colors[value]}`}
    >
      {statusOptions.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}

function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4"
    >
      <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        <Icon className={`text-xl ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider truncate">{label}</p>
        <p className="text-slate-900 text-2xl font-black">{value}</p>
        {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminFetch('/api/admin/stats').then(r => r.json()),
      adminFetch('/api/admin/orders').then(r => r.json()),
    ]).then(([s, o]) => {
      setStats(s)
      setOrders((o.orders || []).slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o))
  }

  const week     = stats?.week || []
  const maxBar   = week.length ? Math.max(...week.map(w => w.orders), 1) : 1

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-slate-900 text-2xl font-black">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back, Admin — here's what's happening today.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full" />
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={FaMoneyBillWave} label="Total Revenue"    value={`AED ${(stats?.totalRevenue || 0).toFixed(0)}`} color="text-teal-600"   bg="bg-teal-50" />
              <StatCard icon={FaShoppingBag}   label="Total Orders"     value={stats?.totalOrders || 0}   color="text-blue-600"   bg="bg-blue-50" />
              <StatCard icon={FaUsers}         label="Registered Users" value={stats?.totalUsers || 0}    color="text-purple-600" bg="bg-purple-50" />
              <StatCard icon={FaEnvelope}      label="Messages"         value={stats?.totalMessages || 0} sub={`${stats?.unreadMessages || 0} unread`} color="text-amber-600" bg="bg-amber-50" />
            </div>

            {/* Status pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Delivered Today', value: stats?.deliveredToday || 0, icon: FaCheckCircle, color: 'text-green-600',  bg: 'bg-green-50 border-green-100' },
                { label: 'Pending Orders',  value: stats?.pendingOrders  || 0, icon: FaClock,       color: 'text-blue-500',   bg: 'bg-blue-50 border-blue-100' },
                { label: 'Unread Messages', value: stats?.unreadMessages || 0, icon: FaFire,        color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 flex items-center gap-3`}>
                  <s.icon className={`${s.color} text-lg flex-shrink-0`} />
                  <div>
                    <p className="text-slate-900 font-black text-lg leading-none">{s.value}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-slate-900 font-bold">Weekly Orders</h2>
                  <p className="text-slate-400 text-xs">Orders placed per day — last 7 days</p>
                </div>
                <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-100">This Week</span>
              </div>
              <div className="flex items-end gap-3 h-36">
                {week.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-slate-500 text-[10px] font-semibold">{d.orders}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.orders / maxBar) * 100}%` }}
                      transition={{ delay: i * 0.07, duration: 0.5 }}
                      className={`w-full rounded-t-lg ${i === 6 ? 'bg-teal-500' : 'bg-teal-100'}`}
                      style={{ minHeight: 8 }}
                    />
                    <span className="text-slate-400 text-[10px]">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-slate-900 font-bold">Recent Orders</h2>
                <a href="/admin/orders" className="text-teal-600 text-xs font-bold hover:underline">View all →</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                        <th key={h} className="px-5 py-3 text-slate-500 text-xs font-bold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No orders yet</td></tr>
                    ) : orders.map((order, i) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-teal-600 font-bold text-xs">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="px-5 py-3.5 text-slate-800 text-xs font-semibold">{order.customerName}</td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs hidden md:table-cell max-w-[180px] truncate">
                          {order.items.map(it => it.name).join(', ')}
                        </td>
                        <td className="px-5 py-3.5 text-slate-800 text-xs font-bold">AED {order.total?.toFixed(2)}</td>
                        <td className="px-5 py-3.5">
                          <StatusDropdown
                            orderId={order._id}
                            current={order.status}
                            onChange={updateOrderStatus}
                          />
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs hidden sm:table-cell">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
