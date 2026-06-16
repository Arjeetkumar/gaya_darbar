import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Trophy, Quote, ChevronRight } from 'lucide-react';
import { WorkoutIntensity } from '../../types';

const Home: React.FC = () => {
  const [intensity, setIntensity] = useState<WorkoutIntensity>('Rest Day');
  const [aiMood, setAiMood] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Calculator States
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [activity, setActivity] = useState<'Sedentary' | 'Moderate' | 'Elite'>('Moderate');
  const [goal, setGoal] = useState<'Shred' | 'Maintain' | 'Bulk'>('Shred');

  // Testimonial State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Mifflin-St Jeor Calculation
  const calculatorResults = useMemo(() => {
    let bmr = 0;
    if (gender === 'Male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultipliers = {
      Sedentary: 1.2,
      Moderate: 1.55,
      Elite: 1.8
    };
    const tdee = Math.round(bmr * activityMultipliers[activity]);

    let targetCalories = tdee;
    if (goal === 'Shred') targetCalories = tdee - 500;
    if (goal === 'Bulk') targetCalories = tdee + 500;

    const pMultiplier = goal === 'Maintain' ? 2.0 : 2.2;
    const proteinGrams = Math.round(weight * pMultiplier);
    const proteinCal = proteinGrams * 4;

    const fatCal = targetCalories * 0.25;
    const fatGrams = Math.round(fatCal / 9);

    const carbCal = targetCalories - proteinCal - fatCal;
    const carbGrams = Math.max(0, Math.round(carbCal / 4));

    return {
      bmr: Math.round(bmr),
      tdee: targetCalories,
      p: proteinGrams,
      c: carbGrams,
      f: fatGrams
    };
  }, [gender, age, weight, height, activity, goal]);

  const testimonials = [
    {
      name: "Rahul Dev",
      role: "Gold's Gym Head Trainer",
      image: "/images/athlete_1.png",
      review: "Gaya Darbar is absolute magic. The Brown Rice Mutton Biryani is my absolute go-to. Hits my protein targets (45g) perfectly after heavy squat sessions.",
      rating: 5,
      macros: "45g P • 65g C • 12g F"
    },
    {
      name: "Dr. Ananya Sen",
      role: "Sports Nutrition Consultant",
      image: "/images/athlete_2.png",
      review: "I recommend their Vault menu to all my competitive athletes. The Greek-yogurt based Butter Chicken is a scientific masterpiece of clean food prep.",
      rating: 5,
      macros: "52g P • 8g C • 10g F"
    },
    {
      name: "Vikram Malhotra",
      role: "State Powerlifter",
      image: "/images/athlete_3.png",
      review: "The Weekly Shred Pack saves me hours of cook time. Eating clean carbs and high-quality lean protein has never been this convenient.",
      rating: 5,
      macros: "350g P • 80g C • 45g F (Batch)"
    }
  ];

  const askChef = async () => {
    if (!aiMood.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moodOrGoal: aiMood,
          intensity
        })
      });
      if (!res.ok) throw new Error('AI request failed');
      const data = await res.json();
      setAiResponse(data.recommendation);
    } catch (error) {
      setAiResponse("Recommendation engine busy. We suggest the nitro-Biryani for heavy lift days!");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <>
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero_background.png" className="w-full h-full object-cover brightness-[0.4] scale-105" alt="Background" />
        </div>
        <div className="relative z-10 text-center text-white px-6 space-y-10">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-1000">
            <span className="inline-block px-6 py-2 bg-emerald-500 rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-xl">Gaya Elite Kitchen</span>
            <h1 className="text-6xl md:text-[8rem] font-display font-bold leading-[0.9] tracking-tight">PREMIUM <br /><span className="text-emerald-400 italic">FUELS.</span></h1>
          </div>
          <p className="text-lg md:text-xl text-slate-200 max-w-xl mx-auto font-medium opacity-90 leading-relaxed tracking-wide">Mughlai Heritage. Scientific Precision. <br />Fuel for the elite athlete.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/menu" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-emerald-500 hover:text-white transition-all shadow-2xl group">Explore Vault <ArrowRight className="inline w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></Link>
            <Link to="/build" className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white/20 transition-all">Analyze Macros</Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 text-emerald-500 font-black tracking-[0.3em] uppercase text-[9px]"><Sparkles className="w-5 h-5" /> Tactical Recommendations</div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-900 leading-tight">What's the <br />mission today?</h2>
            <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
              {['Rest Day', 'HIIT / Cardio', 'Heavy Lifting'].map(opt => (
                <button key={opt} onClick={() => setIntensity(opt as WorkoutIntensity)} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${intensity === opt ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>{opt}</button>
              ))}
            </div>
            <div className="relative group">
              <input type="text" placeholder="State your training goal..." value={aiMood} onChange={e => setAiMood(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-[28px] px-8 py-6 text-slate-900 outline-none pr-40 text-lg font-display shadow-inner focus:ring-4 focus:ring-emerald-500/5 transition-all" />
              <button onClick={askChef} disabled={isAiLoading || !aiMood} className="absolute right-2.5 top-2.5 bottom-2.5 px-6 bg-emerald-500 text-white rounded-2xl font-black text-[9px] tracking-widest hover:bg-slate-900 disabled:opacity-50 uppercase shadow-lg transition-all">{isAiLoading ? 'Analyzing...' : 'Generate Plan'}</button>
            </div>
            {aiResponse && (
              <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[32px] animate-in zoom-in duration-700 relative overflow-hidden group">
                <Quote className="w-8 h-8 text-emerald-200 mb-4" />
                <p className="italic font-display text-xl text-slate-800 leading-relaxed">"{aiResponse}"</p>
              </div>
            )}
          </div>
          <div className="relative lg:block hidden">
            <img src="/images/mission_kitchen.png" className="rounded-[40px] shadow-3xl w-full h-[500px] object-cover" alt="Performance Kitchen" />
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[32px] shadow-2xl flex items-center gap-6 border border-slate-50">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><Trophy className="w-6 h-6" /></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Performance Kitchen</p>
                <p className="text-2xl font-display font-bold text-slate-900">Gaya Ranking #1</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Macro Calculator Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #10b981 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">Macro Engine</span>
            <h2 className="text-5xl font-display font-bold leading-tight">Calculate Your <br />Target Payload.</h2>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">Enter your statistics below. Our sports-nutrition algorithms will project your target calories, protein, carbs, and fat profiles automatically.</p>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Gender Selector */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GENDER</label>
                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                  {['Male', 'Female'].map(g => (
                    <button key={g} onClick={() => setGender(g as any)} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${gender === g ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>{g}</button>
                  ))}
                </div>
              </div>

              {/* Goal Selector */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">MISSION GOAL</label>
                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                  {(['Shred', 'Maintain', 'Bulk'] as const).map(g => (
                    <button key={g} onClick={() => setGoal(g)} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${goal === g ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider Inputs */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>ATHLETE WEIGHT</span>
                  <span className="text-emerald-400 font-bold">{weight} KG</span>
                </div>
                <input type="range" min="40" max="150" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full accent-emerald-500 h-1 bg-slate-750 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>HEIGHT</span>
                  <span className="text-emerald-400 font-bold">{height} CM</span>
                </div>
                <input type="range" min="120" max="220" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-emerald-500 h-1 bg-slate-750 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>AGE</span>
                  <span className="text-emerald-400 font-bold">{age} YEARS</span>
                </div>
                <input type="range" min="15" max="80" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full accent-emerald-500 h-1 bg-slate-750 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">WEEKLY TRAINING DENSITY</label>
                <select value={activity} onChange={e => setActivity(e.target.value as any)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none cursor-pointer">
                  <option value="Sedentary">Sedentary (Rest focus / Desk job)</option>
                  <option value="Moderate">Moderate (3-4 gym workouts per week)</option>
                  <option value="Elite">Elite Athlete (5+ heavy lifting / high-intensity runs)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-slate-800 rounded-[40px] p-12 border border-slate-750 shadow-3xl space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
            <h3 className="text-xl font-display font-bold border-b border-slate-700 pb-4 text-slate-200">Daily Calorie Target</h3>
            
            <div className="text-center py-6">
              <span className="text-6xl md:text-7xl font-display font-bold text-white tracking-tight">{calculatorResults.tdee}</span>
              <span className="text-xs font-black text-emerald-400 block mt-2 uppercase tracking-widest">Kcal / Day Required</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700 text-center">
                <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">PROTEIN</span>
                <span className="text-xl font-bold text-emerald-400">{calculatorResults.p}g</span>
              </div>
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700 text-center">
                <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">CARBS</span>
                <span className="text-xl font-bold text-white">{calculatorResults.c}g</span>
              </div>
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700 text-center">
                <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">FAT</span>
                <span className="text-xl font-bold text-white">{calculatorResults.f}g</span>
              </div>
            </div>

            <Link to="/menu" className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl flex justify-center items-center gap-2">
              Browse Compatible Foods <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Science and Values Grid */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="lg:block hidden relative">
            <img src="/images/nutrition_science.png" className="rounded-[40px] shadow-3xl w-full h-[550px] object-cover" alt="Nutritional Science" />
            <div className="absolute inset-0 bg-slate-900/10 rounded-[40px] pointer-events-none" />
          </div>
          <div className="space-y-12">
            <div className="space-y-3">
              <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Gaya Elite Kitchen</span>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-900 tracking-tight leading-tight">Nutritional Science.<br />Mughlai Tradition.</h2>
            </div>
            <p className="text-slate-505 text-sm leading-relaxed font-medium">We design food with clean, locally sourced ingredients to maximize cellular recovery and physical energy, without compromising the rich, authentic taste of Mughlai cuisine.</p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">1</div>
                <h4 className="text-lg font-bold text-slate-900">Nitrate Pumps</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Beetroot and organic green additions trigger natural nitrate levels to dilate veins and boost oxygen flow during training sessions.</p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">2</div>
                <h4 className="text-lg font-bold text-slate-900">Glycemic Regulation</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">We replace standard processed sugars with natural dates paste and stevia infusions, maintaining clean insulin spikes.</p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-bold">3</div>
                <h4 className="text-lg font-bold text-slate-900">Recovery Velocity</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">High omega-3 river sole and lean chicken breast proteins deliver rapid amino-acid uptake for elite muscle repair.</p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">4</div>
                <h4 className="text-lg font-bold text-slate-900">Thermal Seeding</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Tandoor charcoal grilling naturally unlocks standard digestive enzymes using hand-crushed pepper and garlic rubs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">Athlete Feedback</span>
            <h2 className="text-5xl font-display font-bold text-slate-900">Elite Endorsement.</h2>
            <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">See how top athletic coaches fuel their programs with Gaya Darbar</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-[40px] p-8 md:p-16 border border-slate-100 shadow-2xl relative flex flex-col md:flex-row items-center gap-10 md:gap-16 transition-all duration-700">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden shrink-0 border-4 border-slate-50 shadow-xl">
                <img src={testimonials[activeTestimonial].image} alt={testimonials[activeTestimonial].name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="flex justify-center md:justify-start gap-1 text-emerald-500">
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
                <p className="text-lg md:text-2xl font-display font-bold text-slate-800 leading-relaxed italic">
                  "{testimonials[activeTestimonial].review}"
                </p>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100 pt-6">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 leading-none">{testimonials[activeTestimonial].name}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 block">{testimonials[activeTestimonial].role}</span>
                  </div>
                  <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-600 w-fit mx-auto md:mx-0">
                    {testimonials[activeTestimonial].macros}
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="flex justify-center gap-4 mt-10">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === idx ? 'bg-slate-900 w-8' : 'bg-slate-300 hover:bg-slate-400'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Science Delivery Highlight Illustration */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">Tactical Delivery</span>
            <h2 className="text-5xl font-display font-bold text-slate-900 leading-tight">GPS Hot-Drop Logistics.</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">No more cold meals or broken macros. Our active dispatch riders track your gym check-ins in real-time. Whether you are finishing a workout at boring road centers or Bailey Road academies, your hot-seared nutrients will be dropped exactly at the gym lockers in lock step with your cooldown.</p>
            <Link to="/menu" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg">
              Check Hub Locations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800" className="rounded-[40px] shadow-3xl w-full h-[450px] object-cover" alt="Elite Delivery Prep" />
            <div className="absolute inset-0 bg-slate-900/10 rounded-[40px] pointer-events-none" />
          </div>
        </div>
      </section>

    </>
  );
};

export default Home;
