import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaChartBar, FaShoppingBag, FaUsers, FaEnvelope,
  FaUtensils, FaSignOutAlt, FaBars, FaTimes,
  FaBell, FaSearch, FaHome, FaCog
} from 'react-icons/fa'
import { useAdmin } from '../../context/AdminContext'

const navItems = [
  { label: 'Dashboard',  icon: FaChartBar,    to: '/admin/dashboard' },
  { label: 'Orders',     icon: FaShoppingBag, to: '/admin/orders' },
  { label: 'Users',      icon: FaUsers,       to: '/admin/users' },
  { label: 'Messages',   icon: FaEnvelope,    to: '/admin/messages' },
  { label: 'Menu Items', icon: FaUtensils,    to: '/admin/menu' },
]

function SidebarLink({ item, collapsed, onClick }) {
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
          isActive
            ? 'bg-teal-500 text-white shadow-lg'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      <item.icon className="text-base flex-shrink-0" />
      {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
          {item.label}
        </div>
      )}
    </NavLink>
  )
}

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdmin()
  const navigate          = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/admin') }

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-slate-900 ${mobile ? 'w-72' : collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-slate-800 ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0">
          CH
        </div>
        {(!collapsed || mobile) && (
          <div>
            <div className="font-bold text-white text-sm">Crispy Hub</div>
            <div className="text-teal-400 text-[10px]">Admin Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className={`text-slate-600 text-[10px] font-bold uppercase tracking-widest px-2 mb-2 ${collapsed && !mobile ? 'hidden' : ''}`}>
          Main Menu
        </p>
        {navItems.map(item => (
          <SidebarLink key={item.to} item={item} collapsed={collapsed && !mobile} onClick={() => setMobileOpen(false)} />
        ))}

        <div className="my-3 border-t border-slate-800" />
        <p className={`text-slate-600 text-[10px] font-bold uppercase tracking-widest px-2 mb-2 ${collapsed && !mobile ? 'hidden' : ''}`}>
          Other
        </p>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-semibold"
        >
          <FaHome className="text-base flex-shrink-0" />
          {(!collapsed || mobile) && 'View Website'}
        </a>
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-semibold">
          <FaCog className="text-base flex-shrink-0" />
          {(!collapsed || mobile) && 'Settings'}
        </button>
      </nav>

      {/* Admin info + logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        {(!collapsed || mobile) ? (
          <div className="flex items-center gap-3 px-3 py-3 bg-slate-800 rounded-xl mb-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-black text-xs flex-shrink-0">
              {admin?.avatar || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{admin?.name}</p>
              <p className="text-slate-500 text-[10px] truncate">{admin?.email}</p>
            </div>
          </div>
        ) : null}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-semibold w-full ${collapsed && !mobile ? 'justify-center' : ''}`}
        >
          <FaSignOutAlt className="text-base flex-shrink-0" />
          {(!collapsed || mobile) && 'Sign Out'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (window.innerWidth >= 1024) setCollapsed(c => !c); else setMobileOpen(true) }}
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all"
            >
              <FaBars className="text-sm" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-64">
              <FaSearch className="text-slate-400 text-xs" />
              <input placeholder="Search..." className="bg-transparent text-sm text-slate-600 outline-none placeholder-slate-400 flex-1" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all">
              <FaBell className="text-sm" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-2.5 bg-slate-100 rounded-xl px-3 py-2">
              <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center text-white font-black text-xs">
                {admin?.avatar || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-slate-800 text-xs font-bold">{admin?.name}</p>
                <p className="text-slate-400 text-[10px]">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
