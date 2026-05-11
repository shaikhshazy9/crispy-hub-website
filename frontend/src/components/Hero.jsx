import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaArrowDown, FaWhatsapp } from 'react-icons/fa'
import { featuredItems } from '../data/menuData'

export default function Hero() {
  const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="relative overflow-hidden wave-bottom">
      {/* BG gradient */}
      <div className="absolute inset-0 bg-hero-teal" />

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-400/10 rounded-full -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-800/30 rounded-full translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

      <div className="relative z-10 wrap px-4 sm:px-6 lg:px-8 pt-16 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
            >
              <FaMapMarkerAlt className="text-gold-400" />
              Al Ain, Abu Dhabi · Zakhir
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300">Now Open</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-accent text-gold-400 text-2xl mb-3"
            >
              Welcome to
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display font-black text-white leading-none mb-4"
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
            >
              Crispy <span className="text-gold-400">Hub</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-lg font-accent mb-2"
            >
              Cafeteria & Restaurant
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl md:text-3xl font-display italic text-white/90 mb-8"
            >
              "Serving Looks <span className="text-gold-400">and</span> Flavor."
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 mb-10"
            >
              {[['200+', 'Menu Items'], ['⭐ 5.0', 'Rating'], ['24H', 'Service']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-gold-400 font-black text-xl">{v}</div>
                  <div className="text-white/50 text-xs uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={() => go('#menu')}
                className="btn-primary text-sm"
              >
                🍔 Explore Menu
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                href="https://wa.me/971564460779"
                className="btn-outline-white text-sm"
              >
                <FaWhatsapp /> Order on WhatsApp
              </motion.a>
            </motion.div>
          </div>

          {/* Right — circular food images (pasta site style) */}
          <div className="relative hidden lg:block">
            {/* Center large circle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
              className="relative mx-auto w-72 h-72"
            >
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&auto=format&q=80"
                alt="Crispy Burger"
                className="circular-img w-full h-full"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-3 -right-3 price-tag text-sm font-black"
              >
                AED 16
              </motion.div>
            </motion.div>

            {/* Floating small circles */}
            {[
              { img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=150&h=150&fit=crop&auto=format&q=80', top: '-10%', left: '-15%', price: 'AED 16', delay: 0.6, name: 'Loaded Fries' },
              { img: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=150&h=150&fit=crop&auto=format&q=80', top: '-5%',  right: '-10%', price: 'AED 12', delay: 0.8, name: 'Falooda' },
              { img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=150&h=150&fit=crop&auto=format&q=80', bottom: '-8%', left: '5%',   price: 'AED 13', delay: 1.0, name: 'Biryani' },
              { img: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=150&h=150&fit=crop&auto=format&q=80', bottom: '-5%', right: '0%',   price: 'AED 14', delay: 1.2, name: 'Milkshake' },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
                transition={{ delay: c.delay, type: 'spring', stiffness: 120, y: { duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 } }}
                className="absolute w-24 h-24"
                style={{ top: c.top, left: c.left, right: c.right, bottom: c.bottom }}
              >
                <img src={c.img} alt={c.name} className="circular-img w-full h-full" />
                <span className="price-tag text-xs -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">{c.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll arrow */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => go('#about')}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors z-10"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <FaArrowDown className="text-gold-400" />
        </motion.div>
      </motion.button>
    </section>
  )
}
