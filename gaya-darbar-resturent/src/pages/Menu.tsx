import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Star, ShieldCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MenuItem } from '../../types';

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => {
        if (!res.ok) throw new Error('Network response error');
        return res.json();
      })
      .then(data => {
        setMenuItems(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch menu:', err);
        toast.error("Error loading secure vault items.");
        setIsLoading(false);
      });
  }, []);
  
  const { addToCart } = useCart();
  const { user, updateDiet } = useAuth();
  const diet = user?.diet || 'all';

  const categories = ['All', 'Mass Gain', 'Lean Shred', 'Clean Keto', 'Pre-Workout Fuel', 'Meal Prep Bundles', 'Healthy Desserts'];

  const isDietCompatible = (itemType: 'veg' | 'non-veg' | 'vegan') => {
    if (diet === 'all') return true;
    if (diet === 'veg') return itemType !== 'non-veg';
    if (diet === 'vegan') return itemType === 'vegan';
    return true;
  };

  const filteredMenu = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Accessing the Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="space-y-2">
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.4em]">High Precision Hardware</p>
            <h2 className="text-6xl font-display font-bold text-slate-900 tracking-tight">The Vault.</h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* Iron Guard Controls */}
            <div className="p-1.5 bg-slate-200 rounded-xl flex gap-1 self-start md:self-end">
              {(['all', 'veg', 'vegan'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    updateDiet(mode);
                    toast.info(`Switched to ${mode.toUpperCase()} Protocol`, { icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> });
                  }}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${diet === mode ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {mode === 'all' ? 'No Limits' : mode}
                </button>
              ))}
            </div>

            <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3.5 rounded-xl font-black whitespace-nowrap transition-all text-[9px] tracking-widest uppercase border ${activeCategory === cat ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredMenu.map(item => {
            const isLocked = !isDietCompatible(item.dietType);

            return (
              <div key={item.id} className={`group bg-white rounded-[32px] border border-slate-100 overflow-hidden transition-all duration-500 ${isLocked ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:shadow-2xl hover:-translate-y-2'}`}>
                <div className="relative h-72 overflow-hidden">
                  <img src={item.image} alt={item.name} className={`w-full h-full object-cover transition-transform duration-700 ${isLocked ? '' : 'group-hover:scale-110'}`} />
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-[8px] font-black text-slate-900 uppercase tracking-widest shadow-sm">{item.category}</span>
                  </div>
                  {isLocked && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-rose-500 text-white p-3 rounded-full shadow-2xl">
                        <ShieldAlert className="w-8 h-8" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-5 right-5 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-bold">{item.rating}</span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">{item.name}</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">{item.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100 transition-colors group-hover:bg-emerald-50 group-hover:border-emerald-100">
                      <p className="text-[8px] text-slate-400 font-black uppercase mb-1">PRO</p>
                      <p className="text-sm font-bold text-slate-900">{item.macros.p}g</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100 transition-colors group-hover:bg-emerald-50 group-hover:border-emerald-100">
                      <p className="text-[8px] text-slate-400 font-black uppercase mb-1">CARB</p>
                      <p className="text-sm font-bold text-slate-900">{item.macros.c}g</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100 transition-colors group-hover:bg-emerald-50 group-hover:border-emerald-100">
                      <p className="text-[8px] text-slate-400 font-black uppercase mb-1">KCAL</p>
                      <p className="text-sm font-bold text-slate-900">{item.calories}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => !isLocked && addToCart(item)}
                      disabled={isLocked}
                      className={`w-full py-5 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase flex items-center justify-between px-8 shadow-xl transition-all ${isLocked ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-emerald-500 hover:shadow-emerald-200'}`}
                    >
                      <span>{isLocked ? 'Protocol Locked' : 'Add to Cart'}</span>
                      <span className="flex items-center gap-3">
                        <span className="w-px h-4 bg-white/20" />
                        <span>₹{item.price}</span>
                        {!isLocked && <Plus className="w-4 h-4" />}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Menu;
