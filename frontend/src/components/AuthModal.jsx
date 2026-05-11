import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaUser, FaCheckCircle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

function Input({ icon: Icon, type, placeholder, value, onChange, name, rightEl }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-dark-900 text-sm placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-all"
      />
      {rightEl && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
  )
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
  const { login, signup, loading, error, clearError } = useAuth()
  const [tab, setTab]           = useState(defaultTab)
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [done, setDone]         = useState(false)
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '' })
  const [localErr, setLocalErr] = useState('')

  useEffect(() => { setTab(defaultTab) }, [defaultTab])
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { setDone(false); setForm({ name: '', email: '', password: '', confirm: '' }); setLocalErr('') }, 300)
    }
    clearError?.()
  }, [isOpen, tab])

  const change = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setLocalErr('') }

  const handleLogin = async e => {
    e.preventDefault()
    const res = await login(form.email, form.password)
    if (res.success) { setDone(true); setTimeout(onClose, 1500) }
  }

  const handleSignup = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) return setLocalErr('Passwords do not match.')
    if (form.password.length < 6) return setLocalErr('Password must be at least 6 characters.')
    const res = await signup(form.name, form.email, form.password)
    if (res.success) { setDone(true); setTimeout(onClose, 1500) }
  }

  const errMsg = localErr || error

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-dark-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

              {/* Header */}
              <div className="relative bg-gradient-to-br from-teal-500 to-teal-700 px-7 pt-8 pb-14">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <FaTimes className="text-xs" />
                </button>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-white text-sm">
                    CH
                  </div>
                  <div>
                    <div className="font-display font-bold text-white text-base">Crispy Hub</div>
                    <div className="text-teal-200 text-[10px] font-accent">Cafeteria & Restaurant</div>
                  </div>
                </div>
                <p className="text-white/80 text-sm mt-3">
                  {tab === 'login' ? 'Welcome back! Sign in to your account.' : 'Create your account and start ordering.'}
                </p>
              </div>

              {/* Tab toggle — floats over the header/body break */}
              <div className="relative -mt-6 mx-6">
                <div className="bg-white rounded-2xl shadow-lg flex p-1">
                  {['login', 'signup'].map(t => (
                    <button
                      key={t}
                      onClick={() => { setTab(t); setDone(false); setLocalErr('') }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        tab === t ? 'bg-teal-500 text-white shadow-md' : 'text-gray-500 hover:text-teal-500'
                      }`}
                    >
                      {t === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="px-7 pb-7 pt-5">
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-8 gap-3 text-center"
                    >
                      <FaCheckCircle className="text-teal-500 text-5xl" />
                      <h3 className="font-display text-xl font-bold text-dark-900">
                        {tab === 'login' ? 'Welcome Back!' : 'Account Created!'}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {tab === 'login' ? 'You are now logged in.' : 'Your account is ready. Enjoy ordering!'}
                      </p>
                    </motion.div>
                  ) : tab === 'login' ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleLogin}
                      className="flex flex-col gap-3"
                    >
                      <Input icon={FaEnvelope} type="email" name="email" placeholder="Email address" value={form.email} onChange={change} />
                      <Input
                        icon={FaLock} type={showPass ? 'text' : 'password'} name="password"
                        placeholder="Password" value={form.password} onChange={change}
                        rightEl={
                          <button type="button" onClick={() => setShowPass(p => !p)} className="text-gray-400 hover:text-teal-500 transition-colors">
                            {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                          </button>
                        }
                      />

                      {errMsg && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{errMsg}</p>}

                      <div className="text-right">
                        <button type="button" className="text-teal-600 text-xs font-semibold hover:underline">Forgot password?</button>
                      </div>

                      <motion.button
                        type="submit" disabled={loading}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</> : 'Sign In'}
                      </motion.button>

                      <div className="flex items-center gap-3 my-1">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-gray-400 text-xs">or</span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>

                      <button type="button" className="w-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-dark-900 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                        <FaGoogle className="text-red-500" /> Continue with Google
                      </button>

                      <p className="text-center text-gray-500 text-xs mt-1">
                        No account?{' '}
                        <button type="button" onClick={() => setTab('signup')} className="text-teal-600 font-bold hover:underline">Sign up free</button>
                      </p>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSignup}
                      className="flex flex-col gap-3"
                    >
                      <Input icon={FaUser} type="text" name="name" placeholder="Full name" value={form.name} onChange={change} />
                      <Input icon={FaEnvelope} type="email" name="email" placeholder="Email address" value={form.email} onChange={change} />
                      <Input
                        icon={FaLock} type={showPass ? 'text' : 'password'} name="password"
                        placeholder="Password (min 6 chars)" value={form.password} onChange={change}
                        rightEl={
                          <button type="button" onClick={() => setShowPass(p => !p)} className="text-gray-400 hover:text-teal-500 transition-colors">
                            {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                          </button>
                        }
                      />
                      <Input
                        icon={FaLock} type={showPass2 ? 'text' : 'password'} name="confirm"
                        placeholder="Confirm password" value={form.confirm} onChange={change}
                        rightEl={
                          <button type="button" onClick={() => setShowPass2(p => !p)} className="text-gray-400 hover:text-teal-500 transition-colors">
                            {showPass2 ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                          </button>
                        }
                      />

                      {errMsg && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{errMsg}</p>}

                      <motion.button
                        type="submit" disabled={loading}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</> : 'Create Account'}
                      </motion.button>

                      <div className="flex items-center gap-3 my-1">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-gray-400 text-xs">or</span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>

                      <button type="button" className="w-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-dark-900 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                        <FaGoogle className="text-red-500" /> Continue with Google
                      </button>

                      <p className="text-center text-gray-400 text-xs mt-1">
                        By signing up you agree to our{' '}
                        <span className="text-teal-600 font-semibold cursor-pointer hover:underline">Terms & Conditions</span>
                      </p>

                      <p className="text-center text-gray-500 text-xs">
                        Have an account?{' '}
                        <button type="button" onClick={() => setTab('login')} className="text-teal-600 font-bold hover:underline">Sign in</button>
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
