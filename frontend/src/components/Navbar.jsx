import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaShoppingBag, FaWhatsapp, FaUserCircle, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

const navLinks = [
  { label: 'Home',     href: '#home' },
  { label: 'Menu',     href: '#menu' },
  { label: 'Specials', href: '#specials' },
  { label: 'Gallery',  href: '#gallery' },
  { label: 'Reviews',  href: '#reviews' },
  { label: 'Contact',  href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [open, setOpen]           = useState(false)
  const [authOpen, setAuthOpen]   = useState(false)
  const [authTab, setAuthTab]     = useState('login')
  const [userMenu, setUserMenu]   = useState(false)
  const userMenuRef               = useRef(null)
  const { cartCount }             = useOrders()
  const { user, logout }          = useAuth()
  const location                  = useLocation()
  const navigate                  = useNavigate()
  const isHome                    = location.pathname === '/'

  const openAuth = (tab) => { setAuthTab(tab); setAuthOpen(true) }

  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenu(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const goTo = (href) => {
    setOpen(false)
    if (!isHome) { navigate('/'); setTimeout(() => scrollTo(href), 300) }
    else scrollTo(href)
  }

  const scrollTo = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const navBg = scrolled
    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-cream-200'
    : 'bg-dark-900/90 backdrop-blur-sm'

  const linkColor = scrolled ? 'text-dark-800 hover:text-teal-500' : 'text-white hover:text-gold-400'

  return (
    <>
      {/* Top bar */}
      <div className="bg-teal-700 text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <a href="https://wa.me/971564460779" className="flex items-center gap-1.5 hover:text-gold-300 transition-colors">
          <FaWhatsapp /> WhatsApp: 056 446 0779
        </a>
        <span className="hidden sm:block">Takeaway · Delivery · Dine In</span>
        <span>Al Ain, Abu Dhabi</span>
      </div>

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}
      >
        <div className="wrap flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Crispy Hub"
              className="h-10 w-auto object-contain"
              onError={e => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextSibling.style.display = 'flex'
              }}
            />
            <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl items-center justify-center font-black text-white text-sm shadow-teal hidden">
              CH
            </div>
            <div className="leading-tight">
              <div className={`font-display font-bold text-base transition-colors ${scrolled ? 'text-dark-900' : 'text-white'}`}>
                Crispy Hub
              </div>
              <div className="text-teal-400 text-[10px] font-accent -mt-0.5">Cafeteria & Restaurant</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => goTo(link.href)}
                  className={`nav-link text-xs font-bold tracking-widest uppercase ${linkColor}`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart / Orders */}
            <Link
              to="/orders"
              className="relative flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold text-xs px-4 py-2 rounded-full transition-all hover:shadow-gold"
            >
              <FaShoppingBag />
              <span className="hidden sm:inline">Orders</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth buttons / User menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenu(v => !v)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all text-xs font-bold ${
                    scrolled ? 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100' : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">
                    {user.avatar || user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[80px] truncate">{user.name}</span>
                </button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-cream-200 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-cream-100">
                        <p className="text-dark-900 font-bold text-sm truncate">{user.name}</p>
                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-3 text-dark-700 text-sm hover:bg-cream-50 hover:text-teal-600 transition-colors">
                        <FaShoppingBag className="text-teal-500 text-xs" /> My Orders
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenu(false) }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-red-500 text-sm hover:bg-red-50 transition-colors border-t border-cream-100"
                      >
                        <FaSignOutAlt className="text-xs" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                    scrolled ? 'border-teal-300 text-teal-600 hover:bg-teal-50' : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="text-xs font-bold px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-all shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className={`lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                scrolled ? 'border-cream-300 text-dark-800' : 'border-white/20 text-white'
              }`}
            >
              {open ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[88px] left-0 right-0 z-40 bg-white border-b border-cream-200 shadow-xl lg:hidden"
          >
            <ul className="flex flex-col py-3">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => goTo(link.href)}
                    className="w-full text-left px-6 py-3 text-dark-800 font-semibold text-sm hover:bg-cream-100 hover:text-teal-600 transition-colors border-b border-cream-100"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
              <li className="px-6 py-4 flex flex-col gap-2">
                <Link
                  to="/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 btn-primary w-full justify-center"
                >
                  <FaShoppingBag /> My Orders {cartCount > 0 && `(${cartCount})`}
                </Link>
                {!user ? (
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => { setOpen(false); openAuth('login') }} className="flex-1 py-2.5 rounded-xl border border-teal-300 text-teal-600 font-bold text-sm hover:bg-teal-50 transition-all">
                      Login
                    </button>
                    <button onClick={() => { setOpen(false); openAuth('signup') }} className="flex-1 py-2.5 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-600 transition-all">
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setOpen(false); logout() }} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-all mt-1">
                    <FaSignOutAlt /> Sign Out
                  </button>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </>
  )
}
