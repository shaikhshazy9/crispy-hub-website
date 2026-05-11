import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FaInstagram, FaTiktok, FaFacebook, FaArrowRight } from 'react-icons/fa'

const platforms = [
  { name: 'Instagram', handle: '@crispyhub_rc', url: 'https://www.instagram.com/crispyhub_rc?igsh=ZXExaTJ1aWc2ODBx&utm_source=qr', icon: FaInstagram, bg: 'bg-gradient-to-br from-purple-500 to-pink-500', light: 'bg-purple-50 border-purple-200 hover:border-purple-400', text: 'text-purple-600', followers: '2.4K', desc: 'Daily food shots, reels, and kitchen behind-the-scenes.' },
  { name: 'TikTok',    handle: '@crispyhub_rc', url: 'https://www.tiktok.com/@crispyhub_rc?_r=1&_t=ZS-964it7sJpVB',                  icon: FaTiktok,    bg: 'bg-gradient-to-br from-gray-900 to-gray-700',   light: 'bg-gray-50 border-gray-200 hover:border-gray-400',   text: 'text-gray-700', followers: '1.8K', desc: 'Viral food videos, order unboxings, and fun customer moments.' },
  { name: 'Facebook',  handle: 'Crispy Hub Cafe', url: 'https://www.facebook.com/share/1b8iQ56J1d/?mibextid=wwXIfr',                icon: FaFacebook,  bg: 'bg-gradient-to-br from-blue-600 to-blue-700',   light: 'bg-blue-50 border-blue-200 hover:border-blue-400',   text: 'text-blue-600', followers: '3.1K', desc: 'Latest menu updates, events, offers, and community posts.' },
]

export default function SocialMedia() {
  const [ref, inView] = useInView({ threshold: 0.15 })

  return (
    <section className="section-pad bg-cream-50 relative overflow-hidden">
      <div ref={ref} className="wrap">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="section-sub"
          >
            Follow the Flavour
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            Stay <span className="text-teal-gradient">Connected</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-gray-500 mt-3 max-w-xl mx-auto text-sm"
          >
            Follow us for the latest offers, new menu items, giveaways, and behind-the-scenes content.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => window.open(p.url, '_blank')}
              className={`bg-white border-2 ${p.light} rounded-2xl p-6 cursor-pointer transition-all shadow-card hover:shadow-card-hover`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${p.bg} rounded-2xl flex items-center justify-center text-white text-xl shadow-btn`}>
                  <p.icon />
                </div>
                <div className="text-right">
                  <div className="font-black text-dark-900 text-lg">{p.followers}</div>
                  <div className="text-gray-400 text-xs">Followers</div>
                </div>
              </div>
              <div className="font-bold text-dark-900 mb-0.5">{p.name}</div>
              <div className={`text-sm font-semibold mb-3 ${p.text}`}>{p.handle}</div>
              <p className="text-gray-500 text-sm mb-4">{p.desc}</p>
              <div className={`flex items-center gap-1.5 text-sm font-bold ${p.text}`}>
                Follow Us <FaArrowRight className="text-xs" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="rounded-3xl bg-gradient-to-r from-teal-600 to-teal-800 p-8 md:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 dot-pattern opacity-30" />
          <div className="relative z-10">
            <div className="text-4xl mb-3">🔔</div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Never Miss a Deal
            </h3>
            <p className="text-teal-100 text-sm mb-6 max-w-md mx-auto">
              Follow us on all platforms and be first to know about flash offers, new items, and giveaways.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {platforms.map(p => (
                <motion.a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  className={`${p.bg} text-white font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-btn`}
                >
                  <p.icon /> {p.name}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
