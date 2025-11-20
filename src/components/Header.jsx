import { useState } from 'react'
import { Menu, Calendar, Plane, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="relative z-50">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-semibold tracking-wide">BookMyResort</h1>
            <p className="text-white/60 text-xs">Luxury • Tropical • Minimal</p>
          </div>
        </motion.a>

        <nav className="hidden md:flex items-center gap-6 text-white/80">
          {['Locations', 'Dining', 'Experience', 'Contact'].map((item) => (
            <a key={item} href="#" className="hover:text-white transition-colors flex items-center gap-1">
              <span>{item}</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          ))}
          <a href="#book" className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white shadow transition">Book Now</a>
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg bg-white/10 border border-white/20 text-white">
          <Menu />
        </button>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden mx-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur text-white">
          <div className="p-4 space-y-2">
            {['Locations', 'Dining', 'Experience', 'Contact'].map((item) => (
              <a key={item} href="#" className="block px-3 py-2 rounded-lg hover:bg-white/10">{item}</a>
            ))}
            <a href="#book" className="block text-center px-4 py-2 rounded-lg bg-white/20 border border-white/30">Book Now</a>
          </div>
        </motion.div>
      )}
    </header>
  )
}
