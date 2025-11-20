import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="mt-20">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto max-w-7xl px-6 py-10 text-white/70">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">BookMyResort</h3>
            <p className="text-sm">Escape to curated luxury across tropical destinations. Minimal design, maximum comfort.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Resorts</h4>
            <ul className="space-y-1 text-sm">
              {['Chennai','Salem','Kerala','Madurai','Coimbatore','Bangalore'].map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Experience</h4>
            <ul className="space-y-1 text-sm">
              <li>Spa & Wellness</li>
              <li>Infinity Pool</li>
              <li>Gourmet Dining</li>
              <li>Private Beach</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Contact</h4>
            <p className="text-sm">hello@bookmyresort.com</p>
            <p className="text-sm">+91 98765 43210</p>
          </div>
        </div>
        <div className="mt-8 text-xs text-white/50">© {new Date().getFullYear()} BookMyResort. All rights reserved.</div>
      </motion.div>
    </footer>
  )
}
