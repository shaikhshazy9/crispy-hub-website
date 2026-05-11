import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaInstagram, FaTiktok, FaFacebook, FaPhone, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'

const links = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Menu',     href: '#menu' },
  { label: 'Specials', href: '#specials' },
  { label: 'Gallery',  href: '#gallery' },
  { label: 'Reviews',  href: '#reviews' },
  { label: 'Contact',  href: '#contact' },
]

export default function Footer() {
  const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="bg-dark-900 text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

      <div className="wrap px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center font-black text-white shadow-teal">
              CH
            </div>
            <div>
              <div className="font-display font-bold text-lg text-white">Crispy Hub</div>
              <div className="text-teal-400 text-xs font-accent">Cafeteria & Restaurant</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
            "Serving Looks and Flavor." Your favourite cafe & restaurant in Al Ain, Abu Dhabi.
            200+ menu items, home delivery, and 24-hour service.
          </p>

          {/* Delivery apps */}
          <div className="flex flex-wrap gap-2 mb-5">
            {['Smiles', 'Noon Food', 'Talabat'].map(app => (
              <span key={app} className="bg-white/10 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
                {app}
              </span>
            ))}
          </div>

          {/* Socials */}
          <div className="flex gap-2">
            {[FaInstagram, FaTiktok, FaFacebook].map((Icon, i) => (
              <motion.a
                key={i} href="#"
                whileHover={{ scale: 1.15, y: -2 }}
                className="w-8 h-8 bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-400/40 rounded-xl flex items-center justify-center text-gray-400 hover:text-teal-400 transition-all"
              >
                <Icon className="text-sm" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
          <ul className="flex flex-col gap-2.5">
            {links.map(l => (
              <li key={l.href}>
                <button
                  onClick={() => go(l.href)}
                  className="text-gray-400 text-sm hover:text-teal-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-teal-500/0 group-hover:bg-teal-500 transition-all" />
                  {l.label}
                </button>
              </li>
            ))}
            <li>
              <Link to="/orders" className="text-gray-400 text-sm hover:text-teal-400 transition-colors flex items-center gap-2 group">
                <span className="w-1 h-1 rounded-full bg-teal-500/0 group-hover:bg-teal-500 transition-all" />
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-teal-400 mt-0.5 text-sm flex-shrink-0" />
              <span className="text-gray-400 text-sm">Urwah Bin Zubayr St, 3<br />Zakhir - Al Ain<br />Ramlat Zakher, Abu Dhabi</span>
            </li>
            <li>
              <a href="tel:0337342122" className="flex items-center gap-3 text-gray-400 text-sm hover:text-teal-400 transition-colors">
                <FaPhone className="text-teal-400 text-xs" /> 03 734 2122
              </a>
            </li>
            <li>
              <a href="https://wa.me/971564460779" className="flex items-center gap-3 text-gray-400 text-sm hover:text-green-400 transition-colors">
                <FaWhatsapp className="text-green-400 text-sm" /> 056 446 0779
              </a>
            </li>
          </ul>

          <div className="mt-5 bg-white/5 border border-white/5 rounded-xl p-4">
            <p className="text-white text-xs font-bold uppercase tracking-wider mb-1.5">Opening Hours</p>
            <p className="text-gray-500 text-xs">Mon–Thu: 10:00 AM – 11:00 PM</p>
            <p className="text-gray-500 text-xs">Fri–Sat: 10:00 AM – 12:00 AM</p>
            <p className="text-gray-500 text-xs">Sunday: 12:00 PM – 11:00 PM</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Crispy Hub Cafeteria & Restaurant. All rights reserved. 5% VAT included.</p>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 text-xs cursor-pointer hover:text-gray-400 transition-colors">Terms & Conditions</span>
          <span className="text-gray-700 text-[10px]">·</span>
          <span className="text-gray-700 text-xs cursor-pointer hover:text-gray-400 transition-colors">Privacy Policy</span>
        </div>
      </div>
    </footer>
  )
}
