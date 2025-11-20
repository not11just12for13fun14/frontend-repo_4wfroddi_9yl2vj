import { useState } from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import successAnim from 'https://assets10.lottiefiles.com/packages/lf20_pprxh53t.json'

export default function Confirmation({ bookingSummary, onReset }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const sendEmail = async () => {
    setSending(true)
    const res = await fetch(`${baseUrl}/api/send-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking_id: bookingSummary.bookingId,
        guest_name: name,
        email,
        location: bookingSummary.location,
        check_in_date: bookingSummary.checkIn,
        check_out_date: bookingSummary.checkOut,
        check_in_time: bookingSummary.checkInTime,
        check_out_time: bookingSummary.checkOutTime,
        restaurant_addons: bookingSummary.restaurantItems.map(i=>({ name: i.name, price: i.price, quantity: i.quantity })),
        total_amount: bookingSummary.total
      })
    })
    if (res.ok) setSent(true)
    setSending(false)
  }

  return (
    <div className="text-white">
      <div className="flex flex-col items-center text-center">
        <div className="w-40 h-40">
          <Lottie animationData={successAnim} loop={false} />
        </div>
        <h3 className="text-2xl font-semibold">Booking Successful!</h3>
        <p className="text-white/70">Your booking ID is <span className="font-mono bg-white/10 px-2 py-1 rounded">{bookingSummary.bookingId}</span></p>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
          <h4 className="text-white font-medium mb-2">Booking Details</h4>
          <div className="text-white/80 text-sm space-y-1">
            <div>Location: {bookingSummary.location}</div>
            <div>Check-in: {bookingSummary.checkIn} at {bookingSummary.checkInTime}</div>
            <div>Check-out: {bookingSummary.checkOut} at {bookingSummary.checkOutTime}</div>
            <div>Nights: {bookingSummary.nights}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
          <h4 className="text-white font-medium mb-2">Restaurant Add-ons</h4>
          {bookingSummary.restaurantItems?.length ? (
            <div className="space-y-2 text-white/80 text-sm">
              {bookingSummary.restaurantItems.map(i => (
                <div key={i.name} className="flex items-center justify-between">
                  <div>{i.name} x {i.quantity}</div>
                  <div>₹{i.price * i.quantity}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-sm">No add-ons selected.</p>
          )}
          <div className="mt-3 text-white flex items-center justify-between">
            <div>Total</div>
            <div className="text-xl font-semibold">₹{bookingSummary.total}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/10 border border-white/20 p-4">
        <h4 className="text-white font-medium mb-3">Get confirmation by email</h4>
        <div className="grid md:grid-cols-3 gap-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your full name" className="rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-white/50" />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email address" className="rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-white/50" />
          <button disabled={!email || !name || sending} onClick={sendEmail} className="rounded-xl bg-white text-slate-900 font-semibold p-3 disabled:opacity-50">{sending? 'Sending...' : sent? 'Sent!' : 'Send Email'}</button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button onClick={onReset} className="px-6 py-3 rounded-full bg-white/20 text-white border border-white/30">Make another booking</button>
      </div>
    </div>
  )
}
