import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaTimes, FaSearch, FaTrash } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'

const adminFetch = (path, options = {}) => {
  const token = localStorage.getItem('ch_admin_token')
  return fetch(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers },
  })
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    adminFetch('/api/admin/messages')
      .then(r => r.json())
      .then(d => setMessages(d.messages || []))
      .finally(() => setLoading(false))
  }, [])

  const markRead = async (id) => {
    const res  = await adminFetch(`/api/admin/messages/${id}/read`, { method: 'PATCH' })
    const data = await res.json()
    if (res.ok) {
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m))
    }
  }

  const deleteMsg = async (id) => {
    await adminFetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    setMessages(prev => prev.filter(m => m._id !== id))
    if (selected?._id === id) setSelected(null)
  }

  const open = (msg) => {
    setSelected(msg)
    if (!msg.read) markRead(msg._id)
  }

  const filtered = messages.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.message.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || (filter === 'Unread' ? !m.read : m.read)
    return matchSearch && matchFilter
  })

  const unread = messages.filter(m => !m.read).length

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-slate-900 text-2xl font-black">Messages</h1>
            <p className="text-slate-500 text-sm">
              {unread > 0 ? <span className="text-teal-600 font-semibold">{unread} unread</span> : 'All caught up'} · {messages.length} total
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total',  value: messages.length,          color: 'bg-slate-50 border-slate-200 text-slate-700' },
            { label: 'Unread', value: unread,                   color: 'bg-teal-50 border-teal-200 text-teal-700' },
            { label: 'Read',   value: messages.length - unread, color: 'bg-green-50 border-green-200 text-green-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} border rounded-xl px-4 py-3 text-center`}>
              <p className="font-black text-2xl">{s.value}</p>
              <p className="text-xs font-semibold opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>
          {['All', 'Unread', 'Read'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                filter === f ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-4 border-teal-200 border-t-teal-500 rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Message list */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              <AnimatePresence>
                {filtered.map((msg, i) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => open(msg)}
                    className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:border-teal-300 hover:shadow-md ${
                      selected?._id === msg._id ? 'border-teal-400 shadow-md' : 'border-slate-100'
                    } ${!msg.read ? 'border-l-4 border-l-teal-400' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0 ${!msg.read ? 'bg-teal-500' : 'bg-slate-300'}`}>
                        {msg.read ? <FaEnvelopeOpen className="text-xs" /> : <FaEnvelope className="text-xs" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs truncate ${!msg.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-600'}`}>
                            {msg.name}
                          </p>
                          <span className="text-slate-400 text-[10px] whitespace-nowrap">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[10px] mt-0.5 truncate">{msg.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100">
                  <FaEnvelope className="text-3xl mx-auto mb-3 opacity-30" />
                  <p className="font-semibold text-sm">No messages found</p>
                </div>
              )}
            </div>

            {/* Message detail */}
            <div className="lg:col-span-3">
              {selected ? (
                <motion.div
                  key={selected._id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-4"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Message from {selected.name}</h3>
                      <p className="text-slate-400 text-xs">{new Date(selected.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deleteMsg(selected._id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-all">
                        <FaTrash className="text-xs" />
                      </button>
                      <button onClick={() => setSelected(null)}
                        className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-500 flex items-center justify-center transition-all">
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                      {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{selected.name}</p>
                      <p className="text-teal-600 text-xs">{selected.email}</p>
                      {selected.phone && <p className="text-slate-400 text-xs">{selected.phone}</p>}
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <p className="text-slate-700 text-sm leading-relaxed">{selected.message}</p>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Quick Reply</p>
                    <textarea
                      rows={3}
                      placeholder="Type your reply..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:border-teal-400 transition-all"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <a href={`mailto:${selected.email}`}
                        className="text-teal-600 text-xs font-semibold hover:underline flex items-center gap-1">
                        <FaEnvelope className="text-[10px]" /> Open in email client
                      </a>
                      <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                        <FaReply className="text-[10px]" /> Send Reply
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center py-20 text-slate-400">
                  <FaEnvelope className="text-5xl mb-4 opacity-20" />
                  <p className="font-semibold">Select a message to read</p>
                  <p className="text-xs mt-1">Click any message from the list</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
