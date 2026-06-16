import React from 'react';
import { Order, OrderStatus } from '../types';
import { Clock, ChefHat, Truck, CheckCircle2 } from 'lucide-react';

interface AdminLiveBoardProps {
    orders: Order[];
    onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const AdminLiveBoard: React.FC<AdminLiveBoardProps> = ({ orders, onUpdateStatus }) => {
    const columns = [
        { id: OrderStatus.PENDING, label: 'Pending', icon: <Clock className="w-4 h-4" />, color: 'bg-amber-500' },
        { id: OrderStatus.PREPARING, label: 'Preparing', icon: <ChefHat className="w-4 h-4" />, color: 'bg-blue-500' },
        { id: OrderStatus.OUT_FOR_DELIVERY, label: 'En Route', icon: <Truck className="w-4 h-4" />, color: 'bg-purple-500' },
        { id: OrderStatus.DELIVERED, label: 'Complete', icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-emerald-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)] overflow-x-auto pb-4">
            {columns.map(col => {
                const colOrders = orders.filter(o => o.status === col.id);

                return (
                    <div key={col.id} className="bg-slate-50 rounded-[32px] p-4 flex flex-col border border-slate-100">
                        <div className={`p-4 rounded-2xl ${col.color} text-white font-bold flex items-center justify-between shadow-lg mb-4`}>
                            <div className="flex items-center gap-2">
                                {col.icon}
                                <span className="uppercase tracking-widest text-xs">{col.label}</span>
                            </div>
                            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">{colOrders.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                            {colOrders.map(order => (
                                <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{order.id}</span>
                                        <span className="text-[10px] font-bold text-slate-900">{order.estimatedDeliveryTime}</span>
                                    </div>
                                    <h4 className="font-display font-bold text-slate-900 mb-2 truncate">{order.customerName}</h4>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {order.items.slice(0, 2).map((item, i) => (
                                            <span key={i} className="px-2 py-1 bg-slate-50 text-[9px] font-bold text-slate-500 rounded-lg">{item.quantity}x {item.name.split(' ')[0]}</span>
                                        ))}
                                        {order.items.length > 2 && <span className="px-2 py-1 bg-slate-50 text-[9px] font-bold text-slate-500 rounded-lg">+{order.items.length - 2} more</span>}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {col.id !== OrderStatus.DELIVERED && (
                                            <button
                                                onClick={() => {
                                                    const nextStatus =
                                                        col.id === OrderStatus.PENDING ? OrderStatus.PREPARING :
                                                            col.id === OrderStatus.PREPARING ? OrderStatus.OUT_FOR_DELIVERY :
                                                                OrderStatus.DELIVERED;
                                                    onUpdateStatus(order.id, nextStatus);
                                                }}
                                                className="w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors"
                                            >
                                                Promote
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AdminLiveBoard;
