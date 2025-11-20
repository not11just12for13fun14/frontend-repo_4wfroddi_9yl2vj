import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Locations from './Locations'
import { Calendar as CalendarIcon, Clock, ArrowRight, ArrowLeft } from 'lucide-react'

function getDatesInMonth(year, month) {
  const date = new Date(year, month, 1)
  const dates = []
  const firstDay = date.getDay()
  // push empty slots for alignment
  for (let i = 0; i < firstDay; i++) dates.push(null)
  while (date.getMonth() === month) {
    dates.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return dates
}

function Calendar({ value, onChange, minDate }) {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(value || today))
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const dates = useMemo(() => getDatesInMonth(year, month), [year, month])
  const isDisabled = (d) => (minDate ? d < new Date(minDate) : d < new Date(today.toDateString()))

  return (
    <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="px-3 py-1 rounded-lg bg-white/10">◀</button>
        <div className="font-medium">{cursor.toLocaleString('default', { month: 'long' })} {year}</div>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="px-3 py-1 rounded-lg bg-white/10">▶</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-white/70 text-xs mb-1">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dates.map((d, i) => d ? (
          <button
            key={i}
            disabled={isDisabled(d)}
            onClick={() => onChange(d)}
            className={`aspect-square rounded-lg text-sm transition border border-white/10 ${value && d.toDateString() === new Date(value).toDateString() ? 'bg-white/80 text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'} ${isDisabled(d) ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {d.getDate()}
          </button>
        ) : <div key={i} />)}
      </div>
    </div>
  )
}

export default function BookingFlow({ onBooked }) {
  const [step, setStep] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [checkInTime, setCheckInTime] = useState('14:00')
  const [checkOutTime, setCheckOutTime] = useState('11:00')

  const canContinue = () => {
    if (step === 1) return !!selectedLocation
    if (step === 2) return !!checkIn && !!checkOut
    if (step === 3) return true
    return false
  }

  const handleContinue = () => {
    if (step < 3) setStep(step + 1)
    else onBooked({ selectedLocation, checkIn, checkOut, checkInTime, checkOutTime })
  }

  return (
    <div id="book" className="w-full">
      <div className="flex items-center justify-between mb-4 text-white/80">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step>=1?'bg-white text-slate-900':'bg-white/20 text-white'}`}>1</div>
          <span className="hidden sm:block">Location</span>
        </div>
        <div className="flex-1 h-px bg-white/20 mx-2" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step>=2?'bg-white text-slate-900':'bg-white/20 text-white'}`}>2</div>
          <span className="hidden sm:block">Dates</span>
        </div>
        <div className="flex-1 h-px bg-white/20 mx-2" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step>=3?'bg-white text-slate-900':'bg-white/20 text-white'}`}>3</div>
          <span className="hidden sm:block">Time</span>
        </div>
      </div>

      <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="text-white text-xl font-semibold mb-4">Select Location</h3>
              <Locations selected={selectedLocation?.name} onSelect={(l)=>setSelectedLocation(l)} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><CalendarIcon className="w-5 h-5"/> Check-in</h3>
                <Calendar value={checkIn} onChange={(d)=>setCheckIn(d)} />
              </div>
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><CalendarIcon className="w-5 h-5"/> Check-out</h3>
                <Calendar value={checkOut} minDate={checkIn} onChange={(d)=>setCheckOut(d)} />
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Clock className="w-5 h-5"/> Check-in time</h3>
                <select value={checkInTime} onChange={(e)=>setCheckInTime(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/20 text-white p-3">
                  {['12:00','13:00','14:00','15:00','16:00'].map(t=> <option className="text-slate-900" key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Clock className="w-5 h-5"/> Check-out time</h3>
                <select value={checkOutTime} onChange={(e)=>setCheckOutTime(e.target.value)} className="w-full rounded-xl bg-white/10 border border-white/20 text-white p-3">
                  {['09:00','10:00','11:00','12:00'].map(t=> <option className="text-slate-900" key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={()=>setStep(Math.max(1, step-1))} className="px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Back</button>
          <button disabled={!canContinue()} onClick={handleContinue} className="px-6 py-3 rounded-full bg-white text-slate-900 font-semibold inline-flex items-center gap-2 disabled:opacity-50">
            {step<3 ? 'Continue' : 'Continue to Restaurant'} <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  )
}
