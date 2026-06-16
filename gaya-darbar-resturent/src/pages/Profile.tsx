import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Zap, Flame, Droplet, Clock, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, updateDiet } = useAuth();
    const { addToCart, setIsCartOpen } = useCart();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    const userOrders = data.filter((o: any) => o.customerName === user?.name);
                    setOrders(userOrders);
                }
            } catch (error) {
                console.error("Failed to fetch user orders:", error);
            } finally {
                setIsLoadingOrders(false);
            }
        };
        if (user) {
            fetchUserOrders();
        }
    }, [user]);

    if (!user) return <div className="min-h-screen flex items-center justify-center font-display text-2xl">Loading Profile...</div>;

    // Hardcoded mock data for now
    const level = 12;
    const xp = 4500;
    const nextLevelXp = 5000;
    const progress = (xp / nextLevelXp) * 100;

    return (
        <section className="py-24 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Profile Header */}
                <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-50 shadow-xl shrink-0">
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff&size=256`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">{user.name}</h1>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-md">
                            <Zap size={14} fill="currentColor" /> Level {level} Elite
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-6">Iron Elite Member Since Sept 2023</p>

                        {/* XP Bar */}
                        <div className="max-w-md mx-auto md:mx-0">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                <span>Level {level}</span>
                                <span>{xp} / {nextLevelXp} XP</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full relative" style={{ width: `${progress}%` }}>
                                    <div className="absolute inset-0 bg-white/20" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
                                </div>
                            </div>
                            <p className="text-[10px] text-emerald-600 mt-2 font-bold text-right">{nextLevelXp - xp} XP to next milestone!</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                            <Flame size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">14,200</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Weekly Kcal</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <Droplet size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">850g</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Protein Intake</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">5</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Gym Check-ins</p>
                        </div>
                    </div>
                </div>

                {/* Iron Guard System */}
                <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-display font-bold mb-1">Iron Guard Configuration</h2>
                            <p className="text-sm text-slate-400">Set your dietary protocols. The Vault will adapt automatically.</p>
                        </div>
                        <div className="flex gap-2 bg-white/10 p-1 rounded-2xl border border-white/5">
                            {(['all', 'veg', 'non-veg', 'vegan'] as const).map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => updateDiet(mode)}
                                    className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${user.diet === mode ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {mode === 'all' ? 'No Limits' : mode}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-emerald-500" /> Recent Deployments
                    </h2>
                    <div className="space-y-4">
                        {isLoadingOrders ? (
                            <p className="text-center text-slate-400 py-10 text-xs font-black uppercase tracking-widest animate-pulse">Scanning HQ logs...</p>
                        ) : orders.length === 0 ? (
                            <p className="text-center text-slate-400 py-10 text-xs font-black uppercase tracking-widest">No previous fueling sessions found.</p>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold shrink-0">
                                            #{order.id.split('-')[1] || order.id}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 leading-normal">
                                                {order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                {new Date(order.timestamp).toLocaleString()} • <span className="text-emerald-500 font-bold">{order.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 md:ml-auto flex-wrap">
                                        <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-600">
                                            {order.totalMacros.p}g P
                                        </div>
                                        <span className="font-bold text-lg text-slate-900">₹{order.total}</span>
                                        <button 
                                            onClick={() => {
                                                order.items.forEach((item: any) => {
                                                    addToCart({
                                                        id: item.itemId,
                                                        name: item.name,
                                                        description: '',
                                                        price: item.price,
                                                        category: '',
                                                        image: item.image,
                                                        calories: item.calories,
                                                        macros: { p: item.protein, c: item.carbs, f: item.fats },
                                                        rating: 5.0,
                                                        fuelPoints: Math.floor(item.price / 10),
                                                        dietType: 'all'
                                                    });
                                                });
                                                toast.success("Previous payload added to cart!");
                                                setIsCartOpen(true);
                                            }}
                                            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2"
                                        >
                                            Reorder <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Profile;
