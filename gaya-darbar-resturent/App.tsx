import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';

import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import Layout from './src/components/Layout';
import Home from './src/pages/Home';
import Menu from './src/pages/Menu';
import MealBuilder from './src/pages/MealBuilder';
import Profile from './src/pages/Profile';
import AdminDashboard from './components/AdminDashboard';

const AdminWrapper = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: any) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        toast.success(`Order #${orderId} status updated to ${status}`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status on server.');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        toast.info(`Order #${orderId} has been cancelled.`);
      } else {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to cancel order on server.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Connecting to HQ...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard 
      orders={orders} 
      onUpdateStatus={handleUpdateStatus} 
      onCancelOrder={handleCancelOrder} 
    />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer position="bottom-right" theme="dark" />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="admin" element={<AdminWrapper />} />
              <Route path="build" element={<MealBuilder />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
