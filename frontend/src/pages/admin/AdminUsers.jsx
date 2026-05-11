import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaUsers, FaUserCheck, FaUserTimes, FaEnvelope } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'

const adminFetch = (path, options = {}) => {
  const token = localStorage.getItem('ch_admin_token')
  return fetch(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers },
  })
}

const avatarColors = [
  'bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-amber-500', 'bg-green-500', 'bg-red-500', 'bg-indigo-500',
]

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('All')

  useEffect(() => {
    adminFetch('/api/admin/users')
      .then(r => r.json())
      .then(d => setUsers(d.users || []))
      .finally(() => setLoading(false))
  }, [])

  const toggleBlock = async (id) => {
    const res  = await adminFetch(`/api/admin/users/${id}/block`, { method: 'PATCH' })
    const data = await res.json()
    if (res.ok) {
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: data.user.isBlocked } : u))
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || (filter === 'Blocked' ? u.isBlocked : !u.isBlocked)
    return matchSearch && matchFilter
  })

  const active  = users.filter(u => !u.isBlocked).length
  const blocked = users.filter(u => u.isBlocked).length

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-slate-900 text-2xl font-black">Users</h1>
          <p className="text-slate-500 text-sm">{users.length} total registered users</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Users', value: users.length, icon: FaUsers,     color: 'text-teal-600',  bg: 'bg-teal-50 border-teal-100' },
            { label: 'Active',      value: active,        icon: FaUserCheck, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
            { label: 'Blocked',     value: blocked,       icon: FaUserTimes, color: 'text-red-500',   bg: 'bg-red-50 border-red-100' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 flex items-center gap-3`}>
              <s.icon className={`${s.color} text-xl flex-shrink-0`} />
              <div>
                <p className="text-slate-900 font-black text-2xl leading-none">{s.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>
          {['All', 'Active', 'Blocked'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
                filter === f ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
              }`}
            >
              {f}
            </button>
          ))}
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
                  <tr className="bg-slate-50 border-b border-slate-100 text-left">
                    {['User', 'Email', 'Joined', 'Orders', 'Total Spent', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-slate-500 text-xs font-bold uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((user, i) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 ${avatarColors[i % avatarColors.length]} rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                            {user.name?.slice(0, 2).toUpperCase() || '??'}
                          </div>
                          <p className="text-slate-800 font-semibold text-xs">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <a href={`mailto:${user.email}`} className="text-teal-600 text-xs flex items-center gap-1 hover:underline">
                          <FaEnvelope className="text-[10px]" /> {user.email}
                        </a>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-slate-800 font-bold text-xs">{user.orderCount || 0}</td>
                      <td className="px-5 py-3.5 text-teal-600 font-bold text-xs whitespace-nowrap">
                        AED {(user.totalSpent || 0).toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          user.isBlocked ? 'bg-red-100 text-red-600 border-red-200' : 'bg-green-100 text-green-700 border-green-200'
                        }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleBlock(user._id)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            user.isBlocked
                              ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-500 hover:text-white'
                              : 'bg-red-50 text-red-500 border-red-200 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <FaUsers className="text-3xl mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">{loading ? 'Loading...' : 'No users found'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
