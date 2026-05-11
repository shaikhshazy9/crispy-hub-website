import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { specials } from '../data/menuData'
import { FaFire, FaTag } from 'react-icons/fa'

function SpecialCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="food-card group overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
          loading="lazy"
          onError={e => { e.currentTarget.src = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&h=400&q=80` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />

        {/* Badge */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute top-4 left-4 bg-gradient-to-r ${item.color} text-white badge flex items-center gap-1 shadow-btn`}
        >
          <FaFire className="text-[10px]" /> {item.badge}
        </motion.div>

        {/* Savings */}
        <div className="absolute top-4 right-4 bg-green-500 text-white badge shadow-btn">
          {item.savings}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-dark-900 text-lg mb-2 group-hover:text-teal-600 transition-colors">
          {item.name}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-5">{item.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-teal-600 font-black text-2xl">AED {item.price}</span>
            <span className="text-gray-300 text-sm line-through">AED {item.originalPrice}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5"
          >
            <FaTag className="text-[10px]" /> Grab Deal
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Specials() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section id="specials" className="section-pad bg-cream-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-300/20 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100/60 rounded-full -translate-x-1/3 translate-y-1/3" />

      <div ref={ref} className="wrap relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-sub"
          >
            Limited Time
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Today's <span className="text-gold-gradient">Specials</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-gray-500 mt-3 max-w-xl mx-auto text-sm"
          >
            Handpicked combo deals for the best value. Available daily while stocks last.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specials.map((item, i) => <SpecialCard key={item.id} item={item} index={i} />)}
        </div>

        {/* Order now CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-teal-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 stripe-bg" />
          <div className="relative z-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              Order Online & Get <span className="text-gold-400">5% OFF</span>
            </h3>
            <p className="text-teal-100 mb-6 text-sm">
              Order via Smiles, Noon Food, or Talabat and enjoy exclusive online discounts.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="tel:0337342122" className="btn-primary text-sm">📞 Call 03 734 2122</a>
              <a href="https://wa.me/971564460779" className="btn-outline-white text-sm">WhatsApp Order</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
