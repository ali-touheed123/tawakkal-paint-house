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

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    ordersToday: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const supabase = createClient();
      
      // Fetch summary stats
      const { data: orders } = await supabase
        .from('orders')
        .select('*');
        
      if (orders) {
        const today = new Date().toISOString().split('T')[0];
        const activeOrders = orders.filter(o => o.status !== 'cancelled');
        
        const statsData = {
          totalOrders: activeOrders.length,
          totalRevenue: activeOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
          ordersToday: activeOrders.filter(o => o.created_at?.startsWith(today)).length,
          pendingOrders: activeOrders.filter(o => o.status === 'pending').length
        };
        setStats(statsData);
      }

      // Fetch recent 10 orders
      const { data: recent } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (recent) setRecentOrders(recent);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy">Dashboard Overview</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          title="Orders Today" 
          value={stats.ordersToday} 
          icon={<Clock className="text-orange-600" />} 
          bgColor="bg-orange-50"
        />
        <StatCard 
          title="Pending Orders" 
          value={stats.pendingOrders} 
          icon={<AlertCircle className="text-red-600" />} 
          bgColor="bg-red-50"
        />
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy">Recent Orders</h2>
          <Link 
            href="/admin-7392-dashboard/orders" 
            className="text-gold hover:text-gold-dark font-semibold text-sm flex items-center gap-1"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-navy">{order.customer_name || 'Guest'}</div>
                    <div className="text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-navy">Rs. {Number(order.total).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <div className="p-12 text-center text-gray-400 bg-gray-50">
              No orders found yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor }: { title: string, value: string | number, icon: React.ReactNode, bgColor: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm font-semibold mb-1 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-navy">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>
        {icon}
      </div>
    </div>
  );
}
