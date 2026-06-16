import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart3, Package, Truck, Clock, LayoutDashboard, Zap, CheckCircle2,
  Activity, Home, Building2, Flame, Plus, X, Trash2, ShieldCheck,
  AlertCircle, FileText, ChevronRight, Navigation, TrendingUp, Phone,
  Signal, Map as MapIcon, Crosshair, UserCheck, History, Search,
  Filter, Calendar, RotateCcw, ExternalLink, Layers, Eye, User
} from 'lucide-react';
import { Order, OrderStatus, DeliveryBoy, MealPrepContainer, Macros } from '../types';
import { MOCK_DELIVERY_BOYS, MOCK_MEAL_PREP_CONTAINERS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLiveBoard from './AdminLiveBoard';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onCancelOrder: (orderId: string) => void;
}

const mockChartData = [
  { time: '10am', orders: 12 },
  { time: '12pm', orders: 45 },
  { time: '2pm', orders: 30 },
  { time: '4pm', orders: 55 },
  { time: '6pm', orders: 90 },
  { time: '8pm', orders: 110 },
  { time: '10pm', orders: 45 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, onUpdateStatus, onCancelOrder }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'kanban' | 'delivery' | 'mealprep' | 'history'>('overview');
  const [hoveredOperator, setHoveredOperator] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>(MOCK_DELIVERY_BOYS);

  useEffect(() => {
    fetch('/api/delivery')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) setDeliveryBoys(data);
      })
      .catch(err => console.error("Failed to fetch delivery boys:", err));
  }, [orders]);

  // Simulated GPS tracking drift for couriers
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryBoys(prevBoys =>
        prevBoys.map(boy => {
          if (boy.status === 'active' || boy.status === 'busy') {
            const latDrift = (Math.random() - 0.5) * 0.001;
            const lngDrift = (Math.random() - 0.5) * 0.001;
            return {
              ...boy,
              lat: boy.lat + latDrift,
              lng: boy.lng + lngDrift
            };
          }
          return boy;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getMapPosition = (lat: number, lng: number) => {
    const minLat = 25.5900;
    const maxLat = 25.6200;
    const minLng = 85.1100;
    const maxLng = 85.1600;

    let top = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    let left = ((lng - minLng) / (maxLng - minLng)) * 100;

    top = Math.max(15, Math.min(85, top));
    left = Math.max(15, Math.min(85, left));

    return { top: `${top}%`, left: `${left}%` };
  };

  // History State
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('All');
  const [historyStartDate, setHistoryStartDate] = useState('');
  const [historyEndDate, setHistoryEndDate] = useState('');

  const resetHistoryFilters = () => {
    setHistorySearch('');
    setHistoryStatusFilter('All');
    setHistoryStartDate('');
    setHistoryEndDate('');
  };

  const filteredHistory = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(historySearch.toLowerCase()) ||
        order.id.toLowerCase().includes(historySearch.toLowerCase());
      const matchesStatus = historyStatusFilter === 'All' || order.status === historyStatusFilter;
      const orderDate = new Date(order.timestamp).getTime();
      const start = historyStartDate ? new Date(historyStartDate).setHours(0, 0, 0, 0) : 0;
      const end = historyEndDate ? new Date(historyEndDate).setHours(23, 59, 59, 999) : Infinity;
      return matchesSearch && matchesStatus && (orderDate >= start && orderDate <= end);
    });
  }, [orders, historySearch, historyStatusFilter, historyStartDate, historyEndDate]);

  const stats = {
    revenue: orders.filter(o => o.status === OrderStatus.DELIVERED).reduce((sum, o) => sum + o.total, 0),
    active: orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length,
    completed: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    totalProtein: orders.reduce((sum, o) => sum + o.totalMacros.p, 0),
    activeDrivers: deliveryBoys.filter(d => d.status !== 'offline').length
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-10 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Iron & Fuel HQ System</span>
          </div>
          <h1 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Mission Control</h1>
          <p className="text-slate-500 font-medium tracking-wide">Live Feed • Patna Hub • Operational Mode: Optimal</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Analytics' },
            { id: 'orders', icon: <Package className="w-4 h-4" />, label: 'Live Queue' },
            { id: 'kanban', icon: <Clock className="w-4 h-4" />, label: 'Mission Board' },
            { id: 'delivery', icon: <Navigation className="w-4 h-4" />, label: 'Tactical Map' },
            { id: 'mealprep', icon: <Layers className="w-4 h-4" />, label: 'Inventory' },
            { id: 'history', icon: <History className="w-4 h-4" />, label: 'Archive' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard icon={<TrendingUp />} label="Total Revenue" value={`₹${stats.revenue}`} trend="+12.4% vs prev" color="emerald" />
          <StatCard icon={<Zap />} label="Net Protein Yield" value={`${stats.totalProtein}g`} trend="Across all batches" color="blue" />
          <StatCard icon={<CheckCircle2 />} label="Active Missions" value={stats.active.toString()} trend="In process" color="rose" />
          <StatCard icon={<Activity />} label="Avg Prep Velocity" value="18m" trend="-2m improved" color="amber" />

          <div className="lg:col-span-3 bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 h-[500px] relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-xl font-display font-bold flex items-center gap-4 text-slate-900">
                <BarChart3 className="w-5 h-5 text-emerald-500" /> Dispatch Throughput
              </h3>
            </div>
            <div className="h-[80%] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '20px' }} />
                  <Area type="monotone" dataKey="orders" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-display font-bold mb-8 text-slate-900">Supply Chain</h3>
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-all">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Peak Demand Hub</p>
                  <p className="text-lg font-bold text-slate-900">Boring Road Sector</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Satisfaction</p>
                  <p className="text-lg font-bold text-slate-900">4.92 / 5.0</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                if (orders.length === 0) {
                  alert("No transaction logs to audit.");
                  return;
                }
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `Gaya_Elite_Audit_${new Date().toISOString().split('T')[0]}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="relative z-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-emerald-600 transition-all mt-8 shadow-xl"
            >
              Full Audit
            </button>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-bold text-slate-900">Live Mission Queue</h3>
              <p className="text-slate-400 font-medium text-sm">Managing {orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length} active fueling protocols.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Athlete Payload</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nutritional Breakdown</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hub Location</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Courier Status</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Control Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length === 0 ? (
                  <tr><td colSpan={5} className="py-48 text-center text-slate-300 font-black uppercase tracking-[0.5em] animate-pulse text-xs">Scanning for incoming nutrients...</td></tr>
                ) : (
                  orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).map((order) => {
                    const assignedCourier = deliveryBoys.find(b => b.id === order.deliveryPersonId);

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-10 py-10">
                          <div className="space-y-4">
                            <div>
                              <p className="font-display font-bold text-2xl text-slate-900 leading-none mb-1 group-hover:text-emerald-600 transition-colors">{order.customerName}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Batch ID: #{order.id}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {order.items.map((item, i) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase border border-slate-200">
                                  {item.quantity}x {item.name}
                                </span>
                              ))}
                            </div>
                            {/* Special Instructions UI added here */}
                            {order.specialInstructions && (
                              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] font-bold text-amber-900 leading-relaxed italic">"{order.specialInstructions}"</p>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-10 py-10">
                          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center group-hover:scale-105 transition-transform">
                              <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Protein</p>
                              <p className="text-lg font-bold text-slate-900">{order.totalMacros.p}g</p>
                            </div>
                            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center group-hover:scale-105 transition-transform">
                              <p className="text-[8px] font-black text-orange-600 uppercase tracking-widest mb-1">Carbs</p>
                              <p className="text-lg font-bold text-slate-900">{order.totalMacros.c}g</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center group-hover:scale-105 transition-transform">
                              <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">Fats</p>
                              <p className="text-lg font-bold text-slate-900">{order.totalMacros.f}g</p>
                            </div>
                            <div className="bg-slate-900 rounded-2xl p-4 text-center group-hover:scale-105 transition-transform shadow-lg">
                              <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Calories</p>
                              <p className="text-lg font-bold text-white">{order.totalCalories} kcal</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-10">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              {order.deliveryType === 'Home' ? <Home className="w-5 h-5 text-blue-500" /> : <Building2 className="w-5 h-5 text-emerald-500" />}
                              <span className="text-xs font-black uppercase tracking-widest text-slate-900">{order.deliveryType} Hub</span>
                            </div>
                            <p className="text-xs font-bold text-slate-500 max-w-[200px] leading-relaxed uppercase tracking-tight">
                              {order.location?.flatInfo ? `${order.location.flatInfo}, ` : ''}
                              {order.location?.address}
                              {order.location?.landmark ? ` (Landmark: ${order.location.landmark})` : ''}
                            </p>
                          </div>
                        </td>
                        <td className="px-10 py-10">
                          {assignedCourier ? (
                            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 min-w-[200px]">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2.5 h-2.5 rounded-full ${assignedCourier.status === 'active' ? 'bg-emerald-500 animate-pulse' : assignedCourier.status === 'busy' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{assignedCourier.status}</span>
                                </div>
                                <Phone className="w-3 h-3 text-slate-300" />
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                  <User className="w-4 h-4 text-slate-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">{assignedCourier.name}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Not Assigned</p>
                              <span className="text-[10px] font-bold text-slate-300 italic">Pending Courier Lock</span>
                            </div>
                          )}
                        </td>
                        <td className="px-10 py-10">
                          <div className="flex items-center gap-4">
                            <select
                              className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all cursor-pointer"
                              value={order.status}
                              onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                            >
                              {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button
                              onClick={() => onCancelOrder(order.id)}
                              className="p-3.5 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-10 animate-in fade-in duration-700">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 space-y-10">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
              <div className="space-y-1">
                <h3 className="text-3xl font-display font-bold text-slate-900">Protocol Archive</h3>
                <p className="text-slate-400 font-medium text-sm">Query historical dispatch logs and nutritional data.</p>
              </div>
              <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                <div className="relative flex-1 xl:w-80">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Name or Batch ID..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none text-sm font-bold shadow-inner"
                  />
                </div>
                <button
                  onClick={resetHistoryFilters}
                  className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-500 transition-all border border-slate-100"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[32px] border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Athlete Payload</th>
                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Yield (₹)</th>
                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-10 py-8 font-bold text-slate-900">{new Date(order.timestamp).toLocaleDateString()}</td>
                      <td className="px-8 py-8 font-bold text-slate-900">{order.customerName}</td>
                      <td className="px-8 py-8 font-display font-bold text-lg">₹{order.total}</td>
                      <td className="px-8 py-8">
                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.status === OrderStatus.DELIVERED ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          order.status === OrderStatus.CANCELLED ? 'bg-rose-50 text-rose-600 border-rose-200' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>{order.status}</span>
                      </td>
                      <td className="px-8 py-8">
                        <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'delivery' && (
        <div className="grid lg:grid-cols-4 gap-10 animate-in fade-in duration-700 h-[800px]">
          <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-4 no-scrollbar">
            {deliveryBoys.map(boy => (
              <div
                key={boy.id}
                className={`p-6 rounded-[32px] border transition-all cursor-pointer group ${hoveredOperator === boy.id
                  ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]'
                  : 'bg-white border-slate-100'
                  }`}
                onMouseEnter={() => setHoveredOperator(boy.id)}
                onMouseLeave={() => setHoveredOperator(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${boy.status === 'active' ? 'bg-emerald-500 animate-pulse' : boy.status === 'busy' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                  <Signal className={`w-4 h-4 ${boy.status === 'active' ? 'text-emerald-500' : 'text-slate-300'}`} />
                </div>
                <h4 className="text-xl font-display font-bold mb-1">{boy.name}</h4>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Fleet ID: {boy.id}</p>
                <div className="mt-8 flex gap-3">
                  <a href={`tel:${boy.phone}`} className={`flex-1 py-3.5 rounded-2xl flex items-center justify-center transition-all ${hoveredOperator === boy.id ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-50 text-slate-900'
                    }`}><Phone className="w-4 h-4" /></a>
                  <button className={`flex-1 py-3.5 rounded-2xl flex items-center justify-center transition-all ${hoveredOperator === boy.id ? 'bg-emerald-500' : 'bg-slate-900 text-white'
                    }`}><Crosshair className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 bg-slate-100 rounded-[60px] p-4 shadow-inner border-[12px] border-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            <div className="absolute inset-10 border border-slate-200/50 rounded-[48px] overflow-hidden flex items-center justify-center">
              <div className="text-center opacity-10 grayscale">
                <MapIcon className="w-48 h-48 mx-auto mb-4" />
                <p className="text-[12px] font-black uppercase tracking-[1em]">Patna Hub Map</p>
              </div>

              {deliveryBoys.map((boy) => {
                const pos = getMapPosition(boy.lat, boy.lng);
                return (
                  <div
                    key={boy.id}
                    className="absolute transition-all duration-[4000ms] ease-linear z-10"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <div 
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${hoveredOperator === boy.id ? 'scale-125 ring-4 ring-slate-900' : ''} ${boy.status === 'active' ? 'bg-emerald-500 ring-8 ring-emerald-500/10' : boy.status === 'busy' ? 'bg-amber-500 ring-8 ring-amber-500/10' : 'bg-slate-400 ring-8 ring-slate-400/10'}`}
                      onMouseEnter={() => setHoveredOperator(boy.id)}
                      onMouseLeave={() => setHoveredOperator(null)}
                    >
                      <Truck className="w-6 h-6" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kanban' && (
        <div className="animate-in fade-in duration-700">
          <AdminLiveBoard orders={orders} onUpdateStatus={onUpdateStatus} />
        </div>
      )}

      {activeTab === 'mealprep' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in duration-700">
          {MOCK_MEAL_PREP_CONTAINERS.map(container => (
            <div key={container.id} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group">
              <div className="relative h-64 overflow-hidden">
                <img src={container.image} alt={container.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <h4 className="text-2xl font-display font-bold text-slate-900">{container.name}</h4>
                  <span className="text-2xl font-display font-bold text-emerald-600">₹{container.price}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">PRO</p>
                    <p className="text-sm font-bold text-slate-900">{container.macros.p}g</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">CARB</p>
                    <p className="text-sm font-bold text-slate-900">{container.macros.c}g</p>
                  </div>
                  <div className="text-center p-4 bg-slate-900 rounded-2xl shadow-lg">
                    <p className="text-[8px] font-black text-emerald-400 uppercase mb-1">KCAL</p>
                    <p className="text-sm font-bold text-white">{container.calories}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color }: any) => {
  const colorMap: any = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600'
  };
  return (
    <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-50 hover:shadow-emerald-100/50 transition-all group">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-2xl ${colorMap[color]} group-hover:scale-110 transition-transform shadow-sm`}>{icon}</div>
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-display font-bold text-slate-900">{value}</h3>
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{trend}</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
