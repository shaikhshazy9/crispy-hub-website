import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FaLeaf, FaFire, FaHeart, FaMotorcycle } from 'react-icons/fa'

const values = [
  { icon: FaLeaf,       color: 'bg-green-100 text-green-600',  title: 'Fresh Daily',      desc: 'All ingredients sourced and prepared fresh every single day.' },
  { icon: FaFire,       color: 'bg-orange-100 text-orange-500',title: 'Made with Passion', desc: 'Every dish is crafted with love and attention to detail.' },
  { icon: FaHeart,      color: 'bg-rose-100 text-rose-500',    title: 'Community Loved',   desc: 'Al Ain\'s favourite neighbourhood cafe since opening.' },
  { icon: FaMotorcycle, color: 'bg-teal-100 text-teal-600',   title: 'Fast Delivery',     desc: 'Available on Smiles, Noon Food & Talabat for home delivery.' },
]

export default function About() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section id="about" className="section-pad bg-cream-50 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-72 h-72 bg-teal-100/60 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute left-0 bottom-0 w-48 h-48 bg-gold-300/30 rounded-full -translate-x-1/2 translate-y-1/2" />

      <div ref={ref} className="wrap relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-food">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&h=500&fit=crop"
                alt="Crispy Hub Restaurant"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent" />
            </div>

            {/* Floating info card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-card px-6 py-4 border border-cream-200"
            >
              <div className="text-3xl font-black text-gold-600">AED 3+</div>
              <div className="text-dark-700 text-sm font-semibold">Starts from</div>
              <div className="text-gray-400 text-xs">200+ items on menu</div>
            </motion.div>

            {/* Floating rating */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -top-4 -left-4 bg-teal-500 text-white rounded-2xl shadow-teal px-5 py-3"
            >
              <div className="text-xl font-black">⭐ 5.0</div>
              <div className="text-teal-100 text-xs">Customer Rating</div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="section-sub">Our Story</p>
            <h2 className="section-title mb-5">
              More Than <span className="text-teal-gradient">Just Food</span>
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              Crispy Hub Cafeteria & Restaurant was born from a deep passion for great food and genuine
              hospitality. Located at <strong className="text-teal-600">Urwah Bin Zubayr St, Zakhir, Al Ain</strong>, we
              serve a massive menu of over 200 items — from crispy burgers and loaded fries to fresh juices,
              faloodas, biryanis, and premium milkshakes.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Whether you dine in, take away, or order via Smiles, Noon Food, or Talabat — every meal
              is prepared fresh and served with a smile. Available for home delivery at{' '}
              <a href="tel:0337342122" className="text-teal-500 font-semibold hover:underline">03 734 2122</a>{' '}
              or WhatsApp{' '}
              <a href="https://wa.me/971564460779" className="text-teal-500 font-semibold hover:underline">056 446 0779</a>.
            </p>

            {/* Values */}
            <div className="grid grid-cols-2 gap-3">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all border border-cream-100"
                >
                  <div className={`w-9 h-9 ${v.color} rounded-xl flex items-center justify-center mb-2 text-sm`}>
                    <v.icon />
                  </div>
                  <div className="font-bold text-dark-800 text-sm">{v.title}</div>
                  <div className="text-gray-400 text-xs leading-relaxed mt-1">{v.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
