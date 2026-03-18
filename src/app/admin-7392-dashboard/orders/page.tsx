'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, 
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Package,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    
    const { data } = await query;
    if (data) setOrders(data);
    setLoading(false);
  }
  async function updateOrderStatus(id: string, newStatus: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  }

  async function deleteOrder(id: string) {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

    const supabase = createClient();
    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (!error) {
      setOrders(orders.filter(o => o.id !== id));
      if (selectedOrder && selectedOrder.id === id) {
        setIsModalOpen(false);
        setSelectedOrder(null);
      }
    } else {
      alert('Error deleting order: ' + error.message);
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Orders Management</h1>
          <p className="text-gray-500">Manage customer orders and delivery states.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</span>
                    <div className="text-xs text-gray-400 mt-1">{order.items?.length || 0} Items</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-navy">{order.customer_name || 'Guest'}</div>
                    <div className="text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-navy">
                    <div className="font-bold">Rs. {Number(order.total).toLocaleString()}</div>
                    <div className="text-xs text-green-600">-{order.discount_percent}% Disc.</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                        className="inline-flex items-center gap-1 text-gold hover:text-gold-dark font-bold text-sm"
                      >
                        <Eye size={16} /> View
                      </button>
                      <button 
                        onClick={() => deleteOrder(order.id)}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 font-bold text-sm"
                        title="Delete Order"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-500">#{order.id.slice(0, 8)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="font-bold text-navy">{order.customer_name || 'Guest'}</div>
                  <div className="text-xs text-gray-400">{order.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">{new Date(order.created_at).toLocaleDateString()}</div>
                  <div className="font-black text-navy text-lg">Rs. {Number(order.total).toLocaleString()}</div>
                  <div className="text-[10px] text-green-600">-{order.discount_percent}% Discount</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-gray-400 flex items-center gap-2">
                   <Package size={12} />
                   {order.items?.length || 0} Products
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button 
                     onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                     className="flex-1 bg-gold/10 text-gold px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gold/20 transition-all"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button 
                     onClick={() => deleteOrder(order.id)}
                     className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all border border-red-100"
                     title="Delete Order"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-400 bg-gray-50">
            No orders matches your filter.
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-navy">Order Details</h2>
                <p className="text-sm font-mono text-gray-500">#{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <MoreVertical size={20} className="rotate-90" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Col: Customer Info */}
              <div className="space-y-6">
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400">Name</label>
                      <p className="font-semibold text-navy">{selectedOrder.customer_name || 'Guest'}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">Phone</label>
                      <p className="font-semibold text-navy">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">Email</label>
                      <p className="font-semibold text-navy">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">Address</label>
                      <p className="text-sm text-navy">{selectedOrder.delivery_address}</p>
                      <p className="text-xs font-bold text-gold uppercase mt-1">{selectedOrder.delivery_area}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(selectedOrder.id, s)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all",
                          selectedOrder.status === s 
                            ? "bg-navy text-white shadow-md ring-2 ring-gold" 
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Col: Order Items */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Ordered Products</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:border-gold/30 transition-colors">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-100">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>';
                            }}
                          />
                        ) : (
                          <Package className="text-gray-300" size={32} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-navy">{item.name || item.product?.name || 'Unknown Product'}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1 uppercase">
                          <span>Size: <b className="text-navy">{item.unit_label || item.size}</b></span>
                          <span>Qty: <b className="text-navy">{item.quantity}</b></span>
                          {item.selectedShade && (
                            <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                              <div 
                                className="w-2.5 h-2.5 rounded-full shadow-sm" 
                                style={{ backgroundColor: item.selectedShade.hex }}
                              />
                              <span>Shade: <b className="text-navy">{item.selectedShade.name}</b></span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-navy">Rs. {Number(item.price || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-400 italic">Total: Rs. {Number((item.price || 0) * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-navy rounded-xl p-6 text-white space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span>Rs. {Number(selectedOrder.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Discount ({selectedOrder.discount_percent}%)</span>
                    <span>- Rs. {Number(selectedOrder.discount_amount).toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-xs text-white/40 uppercase font-black">Grand Total</span>
                       <span className="text-payment uppercase text-[10px] bg-white/10 px-2 py-0.5 rounded mt-1 inline-block w-fit">
                         {selectedOrder.payment_method?.replace('_', ' ')}
                       </span>
                    </div>
                    <span className="text-3xl font-black text-gold">Rs. {Number(selectedOrder.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", styles[status])}>
      {status}
    </span>
  );
}
