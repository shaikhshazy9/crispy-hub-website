import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar      from '../components/Navbar'
import Hero        from '../components/Hero'
import About       from '../components/About'
import Menu        from '../components/Menu'
import Specials    from '../components/Specials'
import Gallery     from '../components/Gallery'
import SocialMedia from '../components/SocialMedia'
import Reviews     from '../components/Reviews'
import Contact     from '../components/Contact'
import Footer      from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import Loader      from '../components/Loader'

export default function HomePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Menu />
            <Specials />
            <Gallery />
            <SocialMedia />
            <Reviews />
            <Contact />
          </main>
          <Footer />
          <ScrollToTop />
        </motion.div>
      )}
    </>
  )
}
