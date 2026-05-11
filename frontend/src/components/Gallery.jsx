import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { galleryImages } from '../data/menuData'
import { FaTimes, FaExpand } from 'react-icons/fa'

function Lightbox({ image, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
      >
        <FaTimes />
      </button>
      <motion.img
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        src={image.url.replace('w=600&h=400', 'w=1200&h=800').replace('w=400&h=400', 'w=800&h=800')}
        alt={image.alt}
        className="max-w-4xl max-h-[85vh] w-full h-full object-contain rounded-2xl"
        onClick={e => e.stopPropagation()}
      />
    </motion.div>
  )
}

export default function Gallery() {
  const [ref, inView]       = useInView({ threshold: 0.1 })
  const [selected, setSelected] = useState(null)

  return (
    <section id="gallery" className="section-pad bg-white relative">
      <div ref={ref} className="wrap">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-sub"
          >
            Feast Your Eyes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Our <span className="text-teal-gradient">Gallery</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-gray-500 mt-3 max-w-xl mx-auto text-sm"
          >
            A visual journey through Crispy Hub's finest dishes. Click any photo to view it in full.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelected(img)}
              className={`relative group cursor-pointer rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all ${img.wide ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="aspect-square">
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                  loading="lazy"
                  onError={e => { e.currentTarget.src = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&h=500&q=80` }}
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-dark-900/20 to-transparent flex items-end justify-between p-4"
              >
                <span className="text-white font-semibold text-sm">{img.alt}</span>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <FaExpand className="text-white text-xs" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <Lightbox image={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
