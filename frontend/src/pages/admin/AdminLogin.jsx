import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa'
import { useAdmin } from '../../context/AdminContext'

export default function AdminLogin() {
  const { login, loading, error } = useAdmin()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    const res = await login(form.email, form.password)
    if (res.success) navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <FaShieldAlt className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-white font-bold text-2xl mb-1">Admin Panel</h1>
            <p className="text-slate-400 text-sm">Crispy Hub Cafeteria & Restaurant</p>
          </div>

          {/* Hint */}
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl px-4 py-3 mb-6">
            <p className="text-teal-300 text-xs font-semibold">Demo credentials:</p>
            <p className="text-teal-400 text-xs">Email: admin@crispyhub.ae</p>
            <p className="text-teal-400 text-xs">Password: admin123</p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="email" name="email" value={form.email} onChange={change}
                placeholder="Admin email" required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-700/50 border border-slate-600 text-white rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={change}
                placeholder="Password" required
                className="w-full pl-11 pr-11 py-3.5 bg-slate-700/50 border border-slate-600 text-white rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
              />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-3.5 rounded-xl transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : 'Sign In to Admin Panel'
              }
            </motion.button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-6">
            <a href="/" className="text-teal-500 hover:text-teal-400 transition-colors">← Back to website</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
