import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { reviews } from '../data/menuData'
import { FaStar, FaQuoteRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function ReviewCard({ review, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all p-6 min-w-[300px] sm:min-w-[340px] flex flex-col gap-4 border border-cream-100"
    >
      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: review.rating }).map((_, i) => (
          <FaStar key={i} className="text-gold-500 text-sm" />
        ))}
      </div>

      <FaQuoteRight className="text-teal-100 text-3xl" />

      <p className="text-gray-600 text-sm leading-relaxed flex-1">"{review.text}"</p>

      <div className="flex items-center gap-3 pt-2 border-t border-cream-100">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold text-xs`}>
          {review.avatar}
        </div>
        <div>
          <div className="font-bold text-dark-900 text-sm">{review.name}</div>
          <div className="text-gray-400 text-xs">{review.role} · {review.date}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Reviews() {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const scrollRef = useRef(null)

  const scroll = dir => scrollRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })

  return (
    <section id="reviews" className="section-pad bg-cream-100 relative overflow-hidden">
      <div ref={ref} className="wrap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="section-sub"
            >
              What Customers Say
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              Customer <span className="text-teal-gradient">Reviews</span>
            </motion.h2>
          </div>

          {/* Rating summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-card border border-cream-100 px-6 py-4 flex items-center gap-5"
          >
            <div className="text-center">
              <div className="text-4xl font-black text-gold-600">5.0</div>
              <div className="flex gap-0.5 justify-center">
                {[1,2,3,4,5].map(i => <FaStar key={i} className="text-gold-500 text-xs" />)}
              </div>
              <div className="text-gray-400 text-xs mt-1">Overall</div>
            </div>
            <div className="w-px h-10 bg-cream-200" />
            <div className="text-center">
              <div className="text-2xl font-black text-dark-900">100+</div>
              <div className="text-gray-400 text-xs">Reviews</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll controls */}
        <div className="flex justify-end gap-2 mb-4">
          {[FaChevronLeft, FaChevronRight].map((Icon, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll(i === 0 ? -1 : 1)}
              className="w-9 h-9 bg-white border border-cream-200 rounded-full flex items-center justify-center text-gray-400 hover:text-teal-500 hover:border-teal-300 transition-all shadow-card"
            >
              <Icon className="text-xs" />
            </motion.button>
          ))}
        </div>

        {/* Scrollable reviews */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto no-scrollbar pb-2" style={{ scrollSnapType: 'x mandatory' }}>
          {reviews.map((r, i) => (
            <div key={r.id} style={{ scrollSnapAlign: 'start' }}>
              <ReviewCard review={r} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
