import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import BookingFlow from './components/BookingFlow'
import Restaurant from './components/Restaurant'
import Confirmation from './components/Confirmation'

function formatDate(d){
  if(!d) return ''
  const dd = new Date(d)
  return dd.toISOString().split('T')[0]
}

function App() {
  const [phase, setPhase] = useState('book') // book -> dine -> confirm
  const [booking, setBooking] = useState(null)
  const [restaurantItems, setRestaurantItems] = useState([])
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleBooked = ({ selectedLocation, checkIn, checkOut, checkInTime, checkOutTime }) => {
    setBooking({ selectedLocation, checkIn, checkOut, checkInTime, checkOutTime })
    setPhase('dine')
  }

  const submitBooking = async () => {
    const payload = {
      guest_name: 'Guest',
      email: 'guest@example.com',
      location: booking.selectedLocation.name,
      check_in_date: formatDate(booking.checkIn),
      check_out_date: formatDate(booking.checkOut),
      check_in_time: booking.checkInTime,
      check_out_time: booking.checkOutTime,
      restaurant_addons: restaurantItems.map(i=>({ name: i.name, price: i.price, quantity: i.quantity }))
    }
    const res = await fetch(`${baseUrl}/api/book`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000*60*60*24))
    const pricePer = booking.selectedLocation.price_per_night
    const accommodationTotal = nights * pricePer
    const restaurantTotal = restaurantItems.reduce((a,i)=>a+i.price*i.quantity,0)
    const total = accommodationTotal + restaurantTotal
    setPhase('confirm')
    setBooking(b => ({ ...b, bookingId: data.booking_id, nights, pricePer, accommodationTotal, restaurantTotal, total }))
  }

  const reset = () => {
    setPhase('book')
    setBooking(null)
    setRestaurantItems([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-emerald-900 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_-10%_-10%,rgba(255,255,255,0.18),transparent),radial-gradient(800px_400px_at_110%_10%,rgba(255,255,255,0.12),transparent)] pointer-events-none" />

      <Header />

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Luxury Tropical Stays</h2>
            <p className="mt-3 text-white/70">Glassy minimal design, soft gradients, and buttery animations.</p>
          </motion.div>

          {phase === 'book' && (
            <div className="space-y-10">
              <BookingFlow onBooked={handleBooked} />
            </div>
          )}

          {phase === 'dine' && (
            <div className="space-y-6 text-white">
              <Restaurant initialCart={restaurantItems} onDone={(cart)=>{ setRestaurantItems(cart); submitBooking() }} />
            </div>
          )}

          {phase === 'confirm' && booking && (
            <Confirmation onReset={reset} bookingSummary={{
              bookingId: booking.bookingId,
              location: booking.selectedLocation.name,
              checkIn: formatDate(booking.checkIn),
              checkOut: formatDate(booking.checkOut),
              checkInTime: booking.checkInTime,
              checkOutTime: booking.checkOutTime,
              nights: booking.nights,
              restaurantItems,
              total: booking.total,
            }} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
