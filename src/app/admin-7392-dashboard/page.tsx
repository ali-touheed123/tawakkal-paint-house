'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    ordersToday: 0,
    pendingOrders: 0,
    avgRating: 0,
    pendingReviews: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrderNotification, setNewOrderNotification] = useState(false);

  const fetchDashboardData = async (showNotification = false) => {
    const supabase = createClient();
    
    const [ordersRes, reviewsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*')
    ]);
      
    if (ordersRes.data) {
      if (showNotification && stats.totalOrders > 0 && ordersRes.data.length > stats.totalOrders) {
        setNewOrderNotification(true);
        setTimeout(() => setNewOrderNotification(false), 5000);
      }

      const today = new Date().toISOString().split('T')[0];
      const activeOrders = ordersRes.data.filter(o => o.status !== 'cancelled');
      
      const statsData = {
        totalOrders: activeOrders.length,
        totalRevenue: activeOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
        ordersToday: activeOrders.filter(o => o.created_at?.startsWith(today)).length,
        pendingOrders: activeOrders.filter(o => o.status === 'pending').length,
        avgRating: 0,
        pendingReviews: 0
      };

      if (reviewsRes.data) {
        const approved = reviewsRes.data.filter(r => r.status === 'approved');
        statsData.avgRating = approved.length > 0 
          ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length 
          : 0;
        statsData.pendingReviews = reviewsRes.data.filter(r => r.status === 'pending').length;
      }

      setStats(statsData);
      setRecentOrders(ordersRes.data.slice(0, 5));
    }

    if (reviewsRes.data) {
      const sortedReviews = [...reviewsRes.data].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentReviews(sortedReviews.slice(0, 5));
    }
  };

  useEffect(() => {
    fetchDashboardData().then(() => setLoading(false));

    // Polling for new orders every 30 seconds
    const interval = setInterval(() => fetchDashboardData(true), 30000);
    return () => clearInterval(interval);
  }, [stats.totalOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <AnimatePresence>
        {newOrderNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[100] bg-navy border border-gold/50 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-gold">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">New Order Received!</p>
              <p className="text-xs text-gray-400">Total orders updated.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-3xl font-bold text-navy">Dashboard Overview</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <p className="text-gray-500">Welcome back! Here's your business at a glance.</p>
          <button 
            onClick={async () => {
              const res = await fetch('/api/seo/indexnow', { method: 'POST' });
              const data = await res.json();
              if (data.success) alert('Search engines notified successfully!');
              else alert('Failed to notify search engines. Check logs.');
            }}
            className="px-4 py-2 bg-navy text-white rounded-lg text-xs font-bold hover:bg-gold transition-all flex items-center gap-2 w-fit"
          >
            Notify Search Engines (IndexNow)
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<ShoppingBag className="text-blue-600" />} 
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Total Revenue" 
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`} 
          icon={<TrendingUp className="text-green-600" />} 
          bgColor="bg-green-50"
        />
        <StatCard 
          title="Avg. Rating" 
          value={`${stats.avgRating.toFixed(1)} ⭐`} 
          icon={<TrendingUp className="text-gold" />} 
          bgColor="bg-gold/10"
        />
        <StatCard 
          title="Pending Reviews" 
          value={stats.pendingReviews} 
          icon={<Clock className="text-indigo-600" />} 
          bgColor="bg-indigo-50"
          highlight={stats.pendingReviews > 0}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <ShoppingBag size={20} className="text-gold" />
              Recent Orders
            </h2>
            <Link href="/admin-7392-dashboard/orders" className="text-xs font-bold text-gold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-navy">{order.customer_name || 'Guest'}</p>
                  <p className="text-[10px] text-gray-400 font-mono">#{order.id.slice(0, 8)} • {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-navy">Rs. {Number(order.total).toLocaleString()}</p>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">No recent orders</div>}
          </div>
        </div>

        {/* Recent Activity / Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <Clock size={20} className="text-gold" />
              Recent Reviews
            </h2>
            <Link href="/admin-7392-dashboard/reviews" className="text-xs font-bold text-gold hover:underline">Manage</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-navy">{review.user_name}</p>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "opacity-100" : "opacity-20"}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1 italic">"{review.content}"</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    review.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {review.status}
                  </span>
                  <p className="text-[10px] text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recentReviews.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">No recent reviews</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor, highlight = false }: { title: string, value: string | number, icon: React.ReactNode, bgColor: string, highlight?: boolean }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${highlight ? 'border-indigo-200 ring-2 ring-indigo-50' : 'border-gray-100'} flex items-start justify-between relative overflow-hidden`}>
      {highlight && <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-bl-xl"><AlertCircle size={14} /></div>}
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-bold text-navy">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        {icon}
      </div>
    </div>
  );
}
