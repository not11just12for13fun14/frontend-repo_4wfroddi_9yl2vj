import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, X } from 'lucide-react'

const MENU = [
  { name: 'Tomato Basil Bruschetta', category: 'Starters', price: 180, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Smoked Paneer Tikka', category: 'BBQ', price: 320, image: 'https://images.unsplash.com/photo-1630230596557-ad07b433f5c0?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxUb21hdG8lMjBCYXNpbCUyMEJydXNjaGV0dGF8ZW58MHwwfHx8MTc2MzYyMjAyOXww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
  { name: 'Herb Grilled Chicken', category: 'Main Course', price: 420, image: 'https://images.unsplash.com/photo-1630230596557-ad07b433f5c0?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxUb21hdG8lMjBCYXNpbCUyMEJydXNjaGV0dGF8ZW58MHwwfHx8MTc2MzYyMjAyOXww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
  { name: 'Cold Pressed Watermelon', category: 'Juices', price: 150, image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Belgian Chocolate Mousse', category: 'Desserts', price: 260, image: 'https://images.unsplash.com/photo-1630230596557-ad07b433f5c0?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxUb21hdG8lMjBCYXNpbCUyMEJydXNjaGV0dGF8ZW58MHwwfHx8MTc2MzYyMjAyOXww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
]

export default function Restaurant({ initialCart = [], onDone }) {
  const [open, setOpen] = useState(false)
  const [cart, setCart] = useState(initialCart)
  const [filter, setFilter] = useState('All')

  const categories = ['All','Starters','Main Course','BBQ','Juices','Desserts']

  const filtered = useMemo(() => filter==='All'? MENU : MENU.filter(m => m.category === filter), [filter])

  const add = (item) => {
    setCart((prev) => {
      const idx = prev.findIndex(p => p.name === item.name)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 }
        return copy
      }
      return [...prev, { name: item.name, price: item.price, quantity: 1 }]
    })
  }

  const remove = (name) => setCart((prev) => prev.filter(p => p.name !== name))

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-semibold">Restaurant & Add-ons</h3>
        <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-full bg-white/20 text-white border border-white/30 inline-flex items-center gap-2"><ShoppingCart className="w-4 h-4"/> View Cart ({cart.length})</button>
      </div>

      <div className="flex gap-2 mb-4 overflow-auto">
        {categories.map(c => (
          <button key={c} onClick={()=>setFilter(c)} className={`px-3 py-1 rounded-full border text-sm ${filter===c? 'bg-white text-slate-900 border-white' : 'bg-white/10 text-white border-white/20'}`}>{c}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <motion.div key={item.name} whileHover={{ y: -6 }} className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
            <div className="h-40 overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-white/70 text-sm">{item.category}</p>
                </div>
                <div className="text-white/90 font-semibold">₹{item.price}</div>
              </div>
              <button onClick={()=>add(item)} className="mt-3 w-full rounded-xl bg-white text-slate-900 py-2 font-medium inline-flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> Add to Order</button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }} className="fixed top-0 right-0 h-full w-[90vw] sm:w-[420px] bg-slate-900/80 backdrop-blur-xl border-l border-white/20 p-5 z-[60]">
            <div className="flex items-center justify-between text-white mb-4">
              <h4 className="font-semibold">Your Order</h4>
              <button onClick={()=>setOpen(false)} className="p-2 rounded-lg bg-white/10 border border-white/20"><X/></button>
            </div>
            <div className="space-y-3">
              {cart.length===0 ? (
                <p className="text-white/60">No items yet. Add something delicious!</p>
              ) : (
                cart.map((i) => (
                  <div key={i.name} className="flex items-center justify-between text-white bg-white/5 p-3 rounded-xl border border-white/10">
                    <div>
                      <div className="font-medium">{i.name}</div>
                      <div className="text-sm text-white/70">Qty {i.quantity}</div>
                    </div>
                    <div className="font-semibold">₹{i.price * i.quantity}</div>
                    <button onClick={()=>remove(i.name)} className="ml-2 text-red-300">Remove</button>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-white flex items-center justify-between">
              <div>Total</div>
              <div className="text-xl font-semibold">₹{total}</div>
            </div>
            <button onClick={()=>{ setOpen(false); onDone(cart, total) }} className="mt-4 w-full rounded-xl bg-white text-slate-900 py-3 font-semibold">Continue</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
