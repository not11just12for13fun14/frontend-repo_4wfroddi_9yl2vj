import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, BedDouble, BadgeCheck, Dumbbell, Waves, Sparkles } from 'lucide-react'

const facilitiesIcons = {
  pool: Waves,
  gym: Dumbbell,
  spa: Sparkles,
  yoga: Sparkles,
}

export default function Locations({ selected, onSelect }) {
  const [locations, setLocations] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${baseUrl}/api/locations`).then(r => r.json()).then(setLocations)
  }, [])

  return (
    <div className="w-full">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc, idx) => {
          const Icon = MapPin
          return (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className={`relative overflow-hidden rounded-3xl group border border-white/20 bg-white/5 backdrop-blur-lg ${selected===loc.name ? 'ring-2 ring-white/60' : ''}`}
              onClick={() => onSelect(loc)}
            >
              <div className="absolute inset-0">
                <img src={loc.image} alt={loc.name} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"/>
              </div>
              <div className="relative p-5 flex flex-col justify-end min-h-[260px]">
                <div className="flex items-center gap-2 text-white">
                  <Icon className="w-5 h-5" />
                  <h3 className="text-xl font-semibold">{loc.name}</h3>
                </div>
                <div className="mt-2 text-white/80 flex items-center gap-2">
                  <BedDouble className="w-4 h-4" />
                  <span>₹{loc.price_per_night}/night</span>
                  {loc.available ? (
                    <span className="ml-auto inline-flex items-center gap-1 text-emerald-300 text-sm"><BadgeCheck className="w-4 h-4"/> Available</span>
                  ) : (
                    <span className="ml-auto text-red-300 text-sm">Sold out</span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {loc.facilities.map((f) => {
                    const FIcon = facilitiesIcons[f] || Sparkles
                    return <div key={f} className="px-2 py-1 rounded-full bg-white/10 text-white/80 text-xs flex items-center gap-1"><FIcon className="w-3 h-3"/>{f}</div>
                  })}
                </div>
                <button className="mt-4 inline-flex justify-center rounded-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 transition">View Resort</button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
