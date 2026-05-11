import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaToggleOn, FaToggleOff, FaEdit, FaPlus, FaUtensils } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import { menuItems, menuCategories } from '../../data/menuData'

const tagStyle = {
  "Chef's Special": 'bg-amber-100 text-amber-700',
  'Fan Favourite':  'bg-rose-100  text-rose-700',
  'Best Seller':    'bg-green-100 text-green-700',
  'New':            'bg-blue-100  text-blue-700',
  'Hot Pick':       'bg-red-100   text-red-700',
  'Classic':        'bg-gray-100  text-gray-700',
  'Premium':        'bg-violet-100 text-violet-700',
  'Spicy':          'bg-orange-100 text-orange-700',
}

export default function AdminMenu() {
  const [items, setItems]     = useState(menuItems.map(i => ({ ...i, available: true })))
  const [search, setSearch]   = useState('')
  const [catFilter, setCat]   = useState('all')
  const [editItem, setEditItem] = useState(null)

  const toggleAvailable = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i))
  }

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter === 'all' || i.category === catFilter
    return matchSearch && matchCat
  })

  const available   = items.filter(i => i.available).length
  const unavailable = items.filter(i => !i.available).length

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-slate-900 text-2xl font-black">Menu Items</h1>
            <p className="text-slate-500 text-sm">{items.length} items · {available} available · {unavailable} unavailable</p>
          </div>
          <button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all">
            <FaPlus className="text-xs" /> Add New Item
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {menuCategories.map(cat => {
            const count = items.filter(i => i.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setCat(catFilter === cat.id ? 'all' : cat.id)}
                className={`text-left px-4 py-3 rounded-xl border transition-all ${
                  catFilter === cat.id ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-slate-100 hover:border-teal-200'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <p className={`font-black text-lg ${catFilter === cat.id ? 'text-white' : 'text-slate-900'}`}>{count}</p>
                <p className={`text-xs ${catFilter === cat.id ? 'text-teal-100' : 'text-slate-500'}`}>{cat.label}</p>
              </button>
            )
          })}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400 transition-all"
            />
          </div>
          <button
            onClick={() => setCat('all')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
              catFilter === 'all' ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            All Categories
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                item.available ? 'border-slate-100' : 'border-red-100 opacity-60'
              }`}
            >
              {/* Image */}
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=300&q=80' }}
                />
                {!item.available && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full">UNAVAILABLE</span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${tagStyle[item.tag] || 'bg-gray-100 text-gray-700'}`}>
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-slate-900 font-bold text-sm leading-snug">{item.name}</p>
                  <p className="text-teal-600 font-black text-sm whitespace-nowrap">AED {item.price}</p>
                </div>
                <p className="text-slate-400 text-[10px] mb-3 line-clamp-2">{item.description}</p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAvailable(item.id)}
                    className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl text-xs font-bold border transition-all ${
                      item.available
                        ? 'bg-green-50 border-green-200 text-green-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                        : 'bg-red-50 border-red-200 text-red-500 hover:bg-green-50 hover:border-green-200 hover:text-green-600'
                    }`}
                  >
                    {item.available
                      ? <><FaToggleOn className="text-sm" /> Available</>
                      : <><FaToggleOff className="text-sm" /> Unavailable</>
                    }
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-teal-100 hover:text-teal-600 text-slate-500 flex items-center justify-center transition-all flex-shrink-0">
                    <FaEdit className="text-xs" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-100 mt-4">
            <FaUtensils className="text-4xl mx-auto mb-3 opacity-20" />
            <p className="font-semibold">No menu items found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
