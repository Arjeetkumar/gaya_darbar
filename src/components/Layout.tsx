import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Trophy, Settings, ShoppingBag, Truck, Instagram, Facebook, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Cart from '../../components/Cart';
import VoiceAssistant from './VoiceAssistant';
import StreakModal from './StreakModal';

const Layout = () => {
  const { cart, isCartOpen, setIsCartOpen, clearCart, updateQuantity } = useCart();
  const { user, toggleElite } = useAuth();
  const navigate = useNavigate();
  const [showStreak, setShowStreak] = useState(true);

  // For order tracking demo, we assume there is an active order if there's something in local storage or state
  // We will simplify this and just let the routing handle admin and order tracking.
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-5 cursor-pointer group">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all group-hover:bg-slate-900 group-hover:scale-105">
              <Dumbbell className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold tracking-tight text-slate-900 leading-none">GAYA DARBAR</span>
              <span className="text-[9px] font-black text-emerald-600 tracking-[0.3em] uppercase mt-1">Iron & Fuel House</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">
            <Link to="/menu" className="hover:text-slate-900 transition-colors">The Vault</Link>
            <Link to="/build" className="hover:text-slate-900 transition-colors">Meal Builder</Link>
            <button onClick={() => {
              toggleElite();
              if (!user?.eliteStatus) toast.success("WELCOME TO IRON ELITE STATUS", { icon: <Trophy className="text-yellow-400" /> });
              else toast.info("Elite Status Deactivated");
            }} className={`transition-colors flex items-center gap-2 ${user?.eliteStatus ? 'text-emerald-500' : 'hover:text-slate-900'}`}>
              {user?.eliteStatus ? <><Trophy className="w-4 h-4 text-emerald-500" /> ELITE MEMBER</> : 'Join Elite'}
            </button>
            <Link to="/admin" className="hover:text-slate-900 transition-colors">HQ</Link>
            <Link to="/profile" className="hover:text-slate-900 transition-colors">Profile</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-3 bg-white border border-slate-200 text-slate-400 shadow-sm rounded-xl transition-all hover:bg-slate-900 hover:text-white">
              <Settings className="w-5 h-5" />
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="relative p-3.5 bg-slate-900 text-white rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all">
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-1 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white"><Dumbbell className="w-6 h-6" /></div>
                <span className="text-2xl font-display font-bold text-slate-900 uppercase tracking-tighter">DARBAR</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">Elite Mughlai heritage fused with tactical sports nutrition. Gaya's premier health kitchen.</p>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-emerald-500 text-slate-400 hover:text-white transition-all cursor-pointer"><Instagram className="w-5 h-5" /></div>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-emerald-500 text-slate-400 hover:text-white transition-all cursor-pointer"><Facebook className="w-5 h-5" /></div>
              </div>
            </div>
            <div>
              <h4 className="font-black mb-6 text-slate-900 uppercase tracking-[0.4em] text-[9px]">RESOURCES</h4>
              <ul className="space-y-4 text-slate-400 font-bold text-[11px] tracking-widest uppercase">
                <li><Link to="/menu" className="hover:text-emerald-500 transition-colors">Mass Gain Mughlai</Link></li>
                <li><Link to="/menu" className="hover:text-emerald-500 transition-colors">Lean Asian Protocol</Link></li>
                <li><Link to="/menu" className="hover:text-emerald-500 transition-colors">Clean Keto Systems</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-6 text-slate-900 uppercase tracking-[0.4em] text-[9px]">DISPATCH HQ</h4>
              <ul className="space-y-6 text-slate-500">
                <li className="flex gap-4 items-center">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <p className="font-black text-[11px] uppercase tracking-widest">+91 91428 05071</p>
                </li>
                <li className="flex gap-4 items-center">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <p className="font-black text-[11px] uppercase tracking-widest">BAILEY ROAD, GAYA</p>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-6 text-slate-900 uppercase tracking-[0.4em] text-[9px]">INTEL FEED</h4>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Subscribed to Intel Feed!'); }}>
                <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-[10px] font-black tracking-widest outline-none focus:border-emerald-500 transition-all uppercase" />
                <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-emerald-500 transition-all shadow-xl tracking-[0.3em] uppercase text-[10px]">Sync System</button>
              </form>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2025 Gaya Darbar House • IRON & FUEL PROTOCOL V4.2</p>
          </div>
        </div>
      </footer>

      {/* Cart is handled globally */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onCheckout={async (location, specialInstructions, deliveryType) => {
          try {
            const total = user?.eliteStatus 
              ? Math.round(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.9) 
              : cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const totalMacros = cart.reduce((acc, item) => ({
              p: acc.p + (item.macros.p * item.quantity),
              c: acc.c + (item.macros.c * item.quantity),
              f: acc.f + (item.macros.f * item.quantity),
            }), { p: 0, c: 0, f: 0 });

            const totalCalories = cart.reduce((sum, item) => sum + (item.calories * item.quantity), 0);

            const res = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                customerName: user?.name || 'Athlete Guest',
                items: cart,
                total,
                totalMacros,
                totalCalories,
                deliveryType,
                location,
                specialInstructions
              })
            });

            if (!res.ok) throw new Error('Order submission failed');
            
            const data = await res.json();
            toast.success(`Nutrient Batch Authorized! ID: ${data.orderId}`);
            setIsCartOpen(false);
            clearCart();
          } catch (error) {
            console.error(error);
            toast.error("Failed to authorize order batch.");
          }
        }}
        isElite={user?.eliteStatus || false}
      />

      <VoiceAssistant />
      {showStreak && <StreakModal onClose={() => setShowStreak(false)} />}
    </div>
  );
};

export default Layout;
