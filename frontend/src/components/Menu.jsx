import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { menuCategories, menuItems, tagColors, featuredItems } from '../data/menuData'
import { FaStar, FaPlus, FaCheck, FaFilePdf } from 'react-icons/fa'
import { useOrders } from '../context/OrderContext'
import Toast from './Toast'

function MenuCard({ item }) {
  const { dispatch } = useOrders()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    dispatch({ type: 'ADD', item })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -6 }}
      className="food-card group"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Tag */}
        <span className={`absolute top-3 left-3 badge ${tagColors[item.tag] || 'bg-gray-100 text-gray-600'}`}>
          {item.tag}
        </span>
        {item.popular && (
          <span className="absolute top-3 right-3 bg-gold-500 text-dark-900 badge flex items-center gap-1">
            <FaStar className="text-[9px]" /> Popular
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-dark-900 text-base mb-1 group-hover:text-teal-600 transition-colors">
          {item.name}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-teal-600 font-black text-xl">AED {item.price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-all ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-teal-500 hover:bg-teal-600 text-white shadow-btn hover:shadow-teal'
            }`}
          >
            {added ? <><FaCheck /> Added!</> : <><FaPlus /> Add</>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Menu() {
  const [ref, inView]           = useInView({ threshold: 0.05 })
  const [activeCat, setActiveCat] = useState('burgers')
  const [pdfOpen, setPdfOpen]   = useState(false)
  const [toast, setToast]       = useState(null)

  const filtered = menuItems.filter(i => i.category === activeCat)

  const openPdf = () => {
    window.open('/menu.pdf', '_blank')
  }

  return (
    <section id="menu" className="section-pad bg-white relative" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent" />

      <div className="wrap">
        {/* Featured items row (pasta site style) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <p className="section-sub">Crowd Pleasers</p>
            <h2 className="section-title">Featured <span className="text-teal-gradient">Items</span></h2>
          </div>

          {/* Circular items row like the pasta screenshot */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {featuredItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.05 }}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="circular-img w-full h-full group-hover:scale-105 transition-transform"
                  />
                  <span className="price-tag text-xs -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    AED {item.price}
                  </span>
                </div>
                <span className="text-dark-800 text-xs font-semibold text-center leading-tight group-hover:text-teal-600 transition-colors">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-cream-200 mb-14" />

        {/* Full Menu section */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-sub"
          >
            200+ Items Available
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Our <span className="text-teal-gradient">Menu</span>
          </motion.h2>
        </div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {menuCategories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCat(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                activeCat === cat.id
                  ? 'cat-pill-active border-teal-500'
                  : 'bg-white border-cream-300 text-gray-500 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
          <AnimatePresence mode="wait">
            {filtered.map(item => <MenuCard key={item.id} item={item} />)}
          </AnimatePresence>
        </motion.div>

        {/* View Full Menu PDF CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-dark-800 to-dark-900 p-8 md:p-12 text-center"
        >
          <div className="absolute inset-0 dot-pattern opacity-50" />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-400/30">
              <FaFilePdf className="text-red-400 text-2xl" />
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              View Our <span className="text-gold-400">Full Menu</span>
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
              Browse all 200+ items including Biryani, Wraps, Club Sandwiches, Breakfast, Non-Veg, and much more.
              Click below to open the complete menu PDF.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={openPdf}
              className="btn-primary text-sm inline-flex items-center gap-2"
            >
              <FaFilePdf /> Open Full Menu PDF
            </motion.button>
            <p className="text-gray-600 text-xs mt-4">
              Menu PDF opens in a new tab · Place an order at 03 734 2122
            </p>
          </div>
        </motion.div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </section>
  )
}
