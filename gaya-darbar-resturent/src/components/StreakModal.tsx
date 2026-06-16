import React, { useState, useEffect } from 'react';
import { Flame, X, Check } from 'lucide-react';
// import { useAuth } from '../context/AuthContext'; // If you want to use context for points

const StreakModal = ({ onClose }: { onClose: () => void }) => {
    const [claimed, setClaimed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Mount animation
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleClaim = () => {
        // updateWallet(50); // Optional if using auth context
        setClaimed(true);
        setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for unmount animation
        }, 2000);
    };

    if (claimed) {
        return (
            <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-white rounded-[32px] p-10 text-center shadow-4xl max-w-sm w-full animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Check size={48} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Reward Claimed!</h2>
                    <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs">+₹50 added to Iron Wallet</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded-[40px] p-10 shadow-4xl max-w-md w-full relative animate-in zoom-in duration-500">
                <button className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors" onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}>
                    <X size={20} />
                </button>
                
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
                        <Flame size={48} />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Day 3 Streak!</h1>
                    <p className="text-slate-500 font-medium text-sm">You're on fire! Keep the momentum.</p>
                </div>

                <div className="flex justify-between items-center mb-8 overflow-hidden rounded-2xl bg-slate-50 p-2 border border-slate-100">
                    {[1, 2, 3, 4, 5, 6, 7].map(d => (
                        <div key={d} className={`flex flex-col items-center justify-center w-10 h-12 rounded-xl transition-all ${d <= 3 ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 font-medium'}`}>
                            <span className="text-[8px] uppercase tracking-widest opacity-80">Day</span>
                            <strong className="text-sm">{d}</strong>
                        </div>
                    ))}
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 mb-8 text-center border border-emerald-100">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 block mb-1">Today's Reward</span>
                    <strong className="text-xl font-bold text-slate-900">₹50 Wallet Cash</strong>
                </div>

                <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-rose-500 transition-all shadow-xl" onClick={handleClaim}>
                    Claim Reward
                </button>
            </div>
        </div>
    );
};

export default StreakModal;
