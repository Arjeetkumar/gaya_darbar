import React, { useState } from 'react';
import { Plus, Check, ShoppingBag, Target } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const INGREDIENTS = {
    bases: [
        { id: 'b1', name: 'Brown Rice', macros: { p: 4, c: 45, f: 1, cal: 210 }, price: 50 },
        { id: 'b2', name: 'Quinoa', macros: { p: 8, c: 39, f: 4, cal: 220 }, price: 80 },
        { id: 'b3', name: 'Sweet Potato Mash', macros: { p: 2, c: 20, f: 0, cal: 90 }, price: 60 },
        { id: 'b4', name: 'Cauliflower Rice (Keto)', macros: { p: 2, c: 5, f: 0, cal: 25 }, price: 90 },
    ],
    proteins: [
        { id: 'p1', name: 'Grilled Chicken Breast', macros: { p: 31, c: 0, f: 3, cal: 165 }, price: 150 },
        { id: 'p2', name: 'Lean Mutton Chunks', macros: { p: 25, c: 0, f: 8, cal: 180 }, price: 210 },
        { id: 'p3', name: 'Paneer Cubes', macros: { p: 18, c: 3, f: 20, cal: 260 }, price: 120 },
        { id: 'p4', name: 'Tofu (Vegan)', macros: { p: 15, c: 4, f: 8, cal: 140 }, price: 130 },
    ],
    veggies: [
        { id: 'v1', name: 'Steamed Broccoli', macros: { p: 3, c: 6, f: 0, cal: 35 }, price: 40 },
        { id: 'v2', name: 'Grilled Bell Peppers', macros: { p: 1, c: 5, f: 1, cal: 30 }, price: 40 },
        { id: 'v3', name: 'Zucchini Ribbons', macros: { p: 2, c: 4, f: 0, cal: 20 }, price: 50 },
    ],
    sauces: [
        { id: 's1', name: 'Makhani (Unsweetened)', macros: { p: 2, c: 6, f: 12, cal: 140 }, price: 30 },
        { id: 's2', name: 'Pepper Jus (Zero Cal)', macros: { p: 0, c: 1, f: 0, cal: 10 }, price: 20 },
        { id: 's3', name: 'Spicy Garlic', macros: { p: 1, c: 8, f: 5, cal: 80 }, price: 20 },
    ]
};

const MealBuilder = () => {
    const navigate = useNavigate();
    const { addToCart, setIsCartOpen } = useCart();
    const [build, setBuild] = useState({
        base: INGREDIENTS.bases[0],
        protein: INGREDIENTS.proteins[0],
        veggies: [INGREDIENTS.veggies[0]],
        sauce: INGREDIENTS.sauces[0]
    });

    const [activeTab, setActiveTab] = useState<'base' | 'protein' | 'veggies' | 'sauce'>('base');

    const toggleVeggie = (veg: any) => {
        const exists = build.veggies.find(v => v.id === veg.id);
        if (exists) {
            setBuild(prev => ({ ...prev, veggies: prev.veggies.filter(v => v.id !== veg.id) }));
        } else {
            if (build.veggies.length < 3) {
                setBuild(prev => ({ ...prev, veggies: [...prev.veggies, veg] }));
            }
        }
    };

    const calculateTotal = () => {
        const vegPrice = build.veggies.reduce((acc, v) => acc + v.price, 0);
        return build.base.price + build.protein.price + vegPrice + build.sauce.price;
    };

    const calculateMacros = () => {
        const vegM = build.veggies.reduce((acc, v) => ({
            p: acc.p + v.macros.p, c: acc.c + v.macros.c, f: acc.f + v.macros.f, cal: acc.cal + v.macros.cal
        }), { p: 0, c: 0, f: 0, cal: 0 });

        return {
            p: build.base.macros.p + build.protein.macros.p + vegM.p + build.sauce.macros.p,
            c: build.base.macros.c + build.protein.macros.c + vegM.c + build.sauce.macros.c,
            f: build.base.macros.f + build.protein.macros.f + vegM.f + build.sauce.macros.f,
            cal: build.base.macros.cal + build.protein.macros.cal + vegM.cal + build.sauce.macros.cal,
        };
    };

    const macros = calculateMacros();

    const handleAddStart = () => {
        const customItem = {
            id: `custom-${Date.now()}`,
            name: `Custom Bowl: ${build.protein.name}`,
            description: `Base: ${build.base.name} | Veg: ${build.veggies.map(v => v.name).join(', ')}`,
            price: calculateTotal(),
            category: 'Custom Build',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            calories: macros.cal,
            macros: {
                p: macros.p,
                c: macros.c,
                f: macros.f
            },
            rating: 5.0,
            fuelPoints: Math.floor(calculateTotal() / 10),
            dietType: 'all' as const
        };
        addToCart(customItem);
        setIsCartOpen(true);
    };

    return (
        <section className="py-24 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-2"><Target className="w-4 h-4 inline-block mr-2" />Precision Matrix</p>
                    <h1 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Engine Builder.</h1>
                    <p className="text-slate-500 mt-4 max-w-xl">Construct your nutritional payload exactly to your macronutrient specifications. No compromises.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs */}
                        <div className="flex overflow-x-auto gap-2 no-scrollbar bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                            {(['base', 'protein', 'veggies', 'sauce'] as const).map(step => (
                                <button
                                    key={step}
                                    onClick={() => setActiveTab(step)}
                                    className={`flex-1 min-w-[100px] py-4 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${activeTab === step ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    {step}
                                </button>
                            ))}
                        </div>

                        {/* Options */}
                        <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeTab === 'base' && INGREDIENTS.bases.map(opt => (
                                <div key={opt.id} onClick={() => setBuild({ ...build, base: opt })} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${build.base.id === opt.id ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 bg-white hover:border-emerald-200'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-slate-900">{opt.name}</h3>
                                        <span className="text-[10px] font-black bg-white px-2 py-1 rounded text-slate-500 border border-slate-100 shadow-sm">₹{opt.price}</span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-500">{opt.macros.cal} kcal • {opt.macros.c}g Carbs</p>
                                </div>
                            ))}
                            {activeTab === 'protein' && INGREDIENTS.proteins.map(opt => (
                                <div key={opt.id} onClick={() => setBuild({ ...build, protein: opt })} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${build.protein.id === opt.id ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 bg-white hover:border-emerald-200'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-slate-900">{opt.name}</h3>
                                        <span className="text-[10px] font-black bg-white px-2 py-1 rounded text-slate-500 border border-slate-100 shadow-sm">₹{opt.price}</span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-500">{opt.macros.cal} kcal • {opt.macros.p}g Protein</p>
                                </div>
                            ))}
                            {activeTab === 'veggies' && INGREDIENTS.veggies.map(opt => {
                                const isSelected = build.veggies.find(v => v.id === opt.id);
                                return (
                                    <div key={opt.id} onClick={() => toggleVeggie(opt)} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 bg-white hover:border-emerald-200'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-slate-900">{opt.name}</h3>
                                            <span className="text-[10px] font-black bg-white px-2 py-1 rounded text-slate-500 border border-slate-100 shadow-sm">₹{opt.price}</span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500">{opt.macros.cal} kcal</p>
                                    </div>
                                )
                            })}
                            {activeTab === 'sauce' && INGREDIENTS.sauces.map(opt => (
                                <div key={opt.id} onClick={() => setBuild({ ...build, sauce: opt })} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${build.sauce.id === opt.id ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 bg-white hover:border-emerald-200'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-slate-900">{opt.name}</h3>
                                        <span className="text-[10px] font-black bg-white px-2 py-1 rounded text-slate-500 border border-slate-100 shadow-sm">₹{opt.price}</span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-500">{opt.macros.cal} kcal • {opt.macros.f}g Fats</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 rounded-[32px] p-8 text-white sticky top-32 shadow-2xl">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-8 border-b border-white/10 pb-4">Live Analytics</h2>
                            
                            <div className="flex justify-center mb-10">
                                <div className="text-center">
                                    <div className="text-5xl font-display font-bold text-white mb-2">{macros.cal}</div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Kcal</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-10">
                                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                                    <div className="text-xl font-bold text-white mb-1">{macros.p}g</div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400">PRO</div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                                    <div className="text-xl font-bold text-white mb-1">{macros.c}g</div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400">CARB</div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                                    <div className="text-xl font-bold text-white mb-1">{macros.f}g</div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400">FAT</div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 text-sm font-medium">
                                <div className="flex justify-between items-center text-slate-300">
                                    <span>{build.base.name}</span>
                                    <span>₹{build.base.price}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-300">
                                    <span>{build.protein.name}</span>
                                    <span>₹{build.protein.price}</span>
                                </div>
                                {build.veggies.map(v => (
                                    <div key={v.id} className="flex justify-between items-center text-slate-300">
                                        <span>{v.name}</span>
                                        <span>₹{v.price}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center text-slate-300 border-b border-white/10 pb-4">
                                    <span>{build.sauce.name}</span>
                                    <span>₹{build.sauce.price}</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold pt-2">
                                    <span>Total Value</span>
                                    <span className="text-emerald-400">₹{calculateTotal()}</span>
                                </div>
                            </div>

                            <button onClick={handleAddStart} className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl hover:shadow-emerald-500/20 flex justify-center items-center gap-2">
                                <ShoppingBag className="w-4 h-4" /> Finalize Payload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MealBuilder;
