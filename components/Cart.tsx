
import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, MapPin, CreditCard, ChevronRight, MessageSquareText, Zap, Activity, Home, Building2, Trophy } from 'lucide-react';
import { CartItem, DeliveryType } from '../types';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: (
    location: { lat: number; lng: number; address: string; flatInfo?: string; landmark?: string },
    specialInstructions: string,
    deliveryType: DeliveryType
  ) => void;
  isElite: boolean;
}

const Cart: React.FC<CartProps> = ({ items, isOpen, onClose, onUpdateQuantity, onCheckout, isElite }) => {
  const [address, setAddress] = useState('');
  const [flatInfo, setFlatInfo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('Gym');
  const [step, setStep] = useState<'items' | 'delivery' | 'payment'>('items');

  // Payment states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvv(value);
  };

  const handleCheckoutSubmit = () => {
    if (step === 'items') {
      setStep('delivery');
    } else if (step === 'delivery') {
      if (!address.trim()) {
        alert('Please specify a destination HUB.');
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length !== 16) {
        alert('Please enter a valid 16-digit card number.');
        return;
      }
      if (cardExpiry.length !== 5 || !cardExpiry.includes('/')) {
        alert('Please enter a valid expiry date (MM/YY).');
        return;
      }
      const [month, year] = cardExpiry.split('/').map(Number);
      if (month < 1 || month > 12) {
        alert('Please enter a valid month (01-12).');
        return;
      }
      if (cardCvv.length !== 3) {
        alert('Please enter a valid 3-digit CVV.');
        return;
      }

      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        onCheckout(
          { 
            lat: currentCoords?.lat || 25.5941, 
            lng: currentCoords?.lng || 85.1376, 
            address, 
            flatInfo, 
            landmark 
          }, 
          instructions, 
          deliveryType
        );
      }, 1500);
    }
  };

  const total = isElite ? Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.9) : items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = items.reduce((sum, item) => sum + item.price * item.quantity, 0) - total;
  const totalPoints = items.reduce((sum, item) => sum + (item.fuelPoints * item.quantity), 0);

  const totalMacros = items.reduce((acc, item) => ({
    p: acc.p + (item.macros.p * item.quantity),
    c: acc.c + (item.macros.c * item.quantity),
    f: acc.f + (item.macros.f * item.quantity),
  }), { p: 0, c: 0, f: 0 });

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });
        setAddress("Auto-detected via GPS, Near Bailey Road");
        setIsLocating(false);
      },
      () => {
        setCurrentCoords({ lat: 25.5941, lng: 85.1376 });
        setAddress("Patna Hub HQ");
        setIsLocating(false);
      },
      { timeout: 5000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-4xl animate-in slide-in-from-right duration-500">
        <div className="flex flex-col h-full">
          <div className="p-12 border-b flex justify-between items-center bg-slate-50/50">
            <h2 className="text-4xl font-display font-bold flex items-center gap-6 text-slate-900">
              <div className="w-16 h-16 bg-emerald-500 rounded-[20px] flex items-center justify-center text-white shadow-2xl">
                {/* Fixed: shoppingbag to ShoppingBag */}
                <ShoppingBag className="w-8 h-8" />
              </div>
              Nutrient Batch
            </h2>
            <button onClick={onClose} className="p-4 hover:bg-slate-200 rounded-3xl transition-all">
              <X className="w-7 h-7 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
            {step === 'items' && (
              <div className="space-y-12">
                {items.length === 0 ? (
                  <div className="text-center py-40">
                    <Zap className="w-20 h-20 text-slate-200 mx-auto mb-10" />
                    <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">No active nutrients found.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-10 text-center">Batch Macro Analysis</p>
                      <div className="grid grid-cols-3 gap-8">
                        <div className="text-center">
                          <p className="text-[9px] text-white/40 font-black uppercase mb-3">Protein</p>
                          <p className="text-4xl font-display font-bold text-emerald-400">{totalMacros.p}g</p>
                        </div>
                        <div className="text-center border-x border-white/10">
                          <p className="text-[9px] text-white/40 font-black uppercase mb-3">Carbs</p>
                          <p className="text-4xl font-display font-bold text-white">{totalMacros.c}g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] text-white/40 font-black uppercase mb-3">Fats</p>
                          <p className="text-4xl font-display font-bold text-white">{totalMacros.f}g</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-10 group animate-in slide-in-from-bottom duration-300">
                          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display font-bold text-xl text-slate-900 truncate mb-1">{item.name}</h4>
                            <p className="text-emerald-600 font-black text-[9px] uppercase tracking-widest mb-3">₹{item.price} • {item.calories} KCAL</p>
                            <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100 w-fit">
                              {/* Fixed: minus to Minus */}
                              <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-2 hover:bg-white rounded-lg shadow-sm transition-all"><Minus className="w-3 h-3 text-slate-600" /></button>
                              <span className="text-xs font-black w-10 text-center">{item.quantity}</span>
                              {/* Fixed: plus to Plus */}
                              <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-2 hover:bg-white rounded-lg shadow-sm transition-all"><Plus className="w-3 h-3 text-slate-600" /></button>
                            </div>
                          </div>
                          <p className="font-display font-bold text-xl text-slate-900 pt-1">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 'delivery' && (
              <div className="space-y-12 animate-in slide-in-from-right duration-500">
                <div className="space-y-8">
                  <h3 className="text-3xl font-display font-bold text-slate-900">Target HUB.</h3>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setDeliveryType('Gym')}
                      className={`flex-1 p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${deliveryType === 'Gym' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 text-slate-400'
                        }`}
                    >
                      <Building2 className="w-8 h-8" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Gym Drop-off</span>
                    </button>
                    <button
                      onClick={() => setDeliveryType('Home')}
                      className={`flex-1 p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${deliveryType === 'Home' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 text-slate-400'
                        }`}
                    >
                      <Home className="w-8 h-8" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Home Station</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{deliveryType === 'Home' ? 'Dispatch Location' : 'Gym Name / Center'}</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder={deliveryType === 'Home' ? 'Enter Area / Street...' : 'e.g. Gold Gym, Talwalkars...'}
                          className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] focus:ring-4 focus:ring-emerald-500/10 transition-all text-lg outline-none shadow-inner font-display"
                        />
                        <button
                          onClick={handleGetLocation}
                          disabled={isLocating}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-600 hover:scale-110 transition-transform"
                        >
                          <Activity className={`w-6 h-6 ${isLocating ? 'animate-pulse' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">FLAT / FLOOR</label>
                        <input
                          type="text"
                          value={flatInfo}
                          onChange={(e) => setFlatInfo(e.target.value)}
                          placeholder="Unit 402..."
                          className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LANDMARK</label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="Near SBI..."
                          className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <MessageSquareText className="w-4 h-4" /> Special Instructions
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Allergies, entry codes, extra high protein request..."
                    className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-[28px] focus:ring-4 focus:ring-emerald-500/10 outline-none resize-none shadow-inner text-base font-display"
                  />
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-12 animate-in slide-in-from-right duration-500">
                <h3 className="text-3xl font-display font-bold text-slate-900">Final Authorization.</h3>
                <div className="bg-emerald-600 rounded-[40px] p-10 text-white shadow-4xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24" />
                  <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-center">
                      <CreditCard className="w-10 h-10" />
                      <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase opacity-60">Iron Pass Holder</span>
                    </div>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="#### #### #### ####" 
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        disabled={isProcessingPayment}
                        className="w-full bg-transparent border-none p-0 text-2xl font-mono focus:ring-0 placeholder:text-white/20 text-white outline-none" 
                      />
                    </div>
                    <div className="flex gap-12">
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] text-white/40 uppercase tracking-[0.4em] font-black">VALID THRU</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          disabled={isProcessingPayment}
                          className="w-full bg-transparent border-none p-0 text-xl font-mono focus:ring-0 placeholder:text-white/20 text-white outline-none" 
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] text-white/40 uppercase tracking-[0.4em] font-black">SECURE</label>
                        <input 
                          type="password" 
                          placeholder="***" 
                          value={cardCvv}
                          onChange={handleCvvChange}
                          disabled={isProcessingPayment}
                          className="w-full bg-transparent border-none p-0 text-xl font-mono focus:ring-0 placeholder:text-white/20 text-white outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-10 border-t bg-slate-50/50">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <span className="text-slate-400 font-black uppercase tracking-[0.4em] text-[9px]">Net Investment</span>
                  <p className="text-4xl font-display font-bold text-slate-900 mt-1">₹{total}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-black uppercase tracking-[0.4em] text-[9px]">Fuel Yield</span>
                  <p className="text-2xl font-display font-bold text-emerald-600 mt-1">{totalMacros.p}g P</p>
                </div>
              </div>

              <button
                onClick={handleCheckoutSubmit}
                disabled={isProcessingPayment}
                className="w-full bg-slate-900 text-white py-8 rounded-[32px] font-black text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all shadow-4xl uppercase active:scale-95 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authorising Prep...</span>
                  </>
                ) : (
                  <>
                    {step === 'items' ? 'Authorize Prep' : step === 'delivery' ? 'Lock HUB' : 'Finalize Fueling'} 
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
