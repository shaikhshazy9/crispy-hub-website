import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FaMapMarkerAlt, FaPhone, FaClock, FaWhatsapp, FaCheckCircle } from 'react-icons/fa'

const info = [
  { icon: FaMapMarkerAlt, color: 'bg-teal-100 text-teal-600', title: 'Location', lines: ['Urwah Bin Zubayr St, 3', 'Zakhir - Al Ain, Ramlat Zakher'], link: null },
  { icon: FaPhone,        color: 'bg-blue-100 text-blue-600',  title: 'Phone',    lines: ['03 734 2122'], link: 'tel:0337342122' },
  { icon: FaWhatsapp,     color: 'bg-green-100 text-green-600',title: 'WhatsApp', lines: ['056 446 0779'], link: 'https://wa.me/971564460779' },
  { icon: FaClock,        color: 'bg-gold-300/40 text-gold-700',title: 'Hours',   lines: ['Mon–Thu: 10am – 11pm', 'Fri–Sat: 10am – 12am', 'Sun: 12pm – 11pm'], link: null },
]

export default function Contact() {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const [form, setForm]     = useState({ name: '', phone: '', email: '', message: '' })
  const [done, setDone]     = useState(false)
  const [loading, setLoading] = useState(false)

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const [submitError, setSubmitError] = useState(null)

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send message.')
      setDone(true)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section-pad bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent" />

      <div ref={ref} className="wrap">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="section-sub">Get In Touch</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="section-title">
            Contact <span className="text-teal-gradient">Us</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {info.map((i, idx) => (
                <motion.div
                  key={i.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="bg-cream-50 border border-cream-200 hover:border-teal-300 rounded-2xl p-4 transition-all"
                >
                  <div className={`w-9 h-9 ${i.color} rounded-xl flex items-center justify-center mb-3 text-sm`}>
                    <i.icon />
                  </div>
                  <div className="font-bold text-dark-900 text-sm mb-1">{i.title}</div>
                  {i.lines.map((line, j) => (
                    i.link && j === 0
                      ? <a key={j} href={i.link} className="block text-teal-600 text-xs font-semibold hover:underline">{line}</a>
                      : <p key={j} className="text-gray-500 text-xs">{line}</p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="rounded-2xl overflow-hidden border border-cream-200 h-48 relative"
            >
              <iframe
                title="Crispy Hub Location"
                src="https://maps.google.com/maps?q=Urwah+Bin+Zubayr+St,+Zakhir,+Al+Ain,+Abu+Dhabi,+UAE&output=embed&z=16"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
                <div className="bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-teal">
                  <FaMapMarkerAlt /> Urwah Bin Zubayr St, Zakhir, Al Ain
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }}>
            <div className="bg-cream-50 border border-cream-200 rounded-3xl p-7">
              {done ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                >
                  <FaCheckCircle className="text-teal-500 text-5xl" />
                  <h3 className="font-display text-xl font-bold text-dark-900">Message Sent!</h3>
                  <p className="text-gray-500 text-sm max-w-xs">We will get back to you shortly. You can also reach us directly on WhatsApp.</p>
                  <button onClick={() => { setDone(false); setForm({ name: '', phone: '', email: '', message: '' }) }} className="btn-teal text-xs mt-2">
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold text-dark-900 mb-1">Send a Message</h3>
                  <p className="text-gray-400 text-sm mb-6">We reply within 24 hours.</p>

                  <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">Full Name *</label>
                        <input type="text" name="name" value={form.name} onChange={change} required placeholder="Your name" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">Phone</label>
                        <input type="tel" name="phone" value={form.phone} onChange={change} placeholder="+971 50 000 0000" className="input-field" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={change} required placeholder="your@email.com" className="input-field" />
                    </div>

                    <div>
                      <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">Message *</label>
                      <textarea name="message" value={form.message} onChange={change} required rows={4} placeholder="Tell us about your enquiry..." className="input-field resize-none" />
                    </div>

                    {submitError && (
                      <p className="text-red-500 text-xs text-center -mt-1">{submitError}</p>
                    )}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-teal w-full justify-center disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                          Sending...
                        </span>
                      ) : 'Send Message ✉️'}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
