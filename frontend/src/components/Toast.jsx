import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'

export default function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      className="fixed bottom-6 right-6 z-[200] bg-dark-900 text-white text-sm font-semibold px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-teal-500/30"
    >
      <span className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
        <FaCheck className="text-xs" />
      </span>
      {message}
    </motion.div>
  )
}
