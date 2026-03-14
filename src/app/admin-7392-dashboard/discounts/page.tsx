'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Percent, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DiscountsPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('discount_rules')
      .select('*')
      .order('min_amount', { ascending: true });
    
    if (data) setRules(data);
    setLoading(false);
  }

  async function toggleStatus(id: string, current: boolean) {
    const supabase = createClient();
    const { error } = await supabase
      .from('discount_rules')
      .update({ is_active: !current })
      .eq('id', id);
    
    if (!error) {
      setRules(rules.map(r => r.id === id ? { ...r, is_active: !current } : r));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this discount rule?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('discount_rules').delete().eq('id', id);
    if (!error) {
      setRules(rules.filter(r => r.id !== id));
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newRule = {
      min_amount: Number(formData.get('min_amount')),
      discount_percent: Number(formData.get('discount_percent')),
      is_active: true
    };

    const supabase = createClient();
    const { error } = await supabase.from('discount_rules').insert([newRule]);
    
    if (!error) {
      fetchRules();
      setIsModalOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Checkout Discounts</h1>
          <p className="text-gray-500">Configure automatic discounts that apply at checkout.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Add Tier
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
        <Info size={20} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          Rules are applied automatically based on the cart subtotal. Only one rule (the highest qualifying tier) will be applied at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((rule) => (
          <div key={rule.id} className={cn(
            "bg-white rounded-2xl p-6 border-2 transition-all shadow-sm relative overflow-hidden group",
            rule.is_active ? "border-gold/30 hover:shadow-xl hover:translate-y-[-4px]" : "border-gray-100 opacity-60"
          )}>
            <div className="flex items-center justify-between mb-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl",
                rule.is_active ? "bg-gold text-navy" : "bg-gray-100 text-gray-400"
              )}>
                {rule.discount_percent}%
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => toggleStatus(rule.id, rule.is_active)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    rule.is_active ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"
                  )}
                >
                  {rule.is_active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
                <button 
                   onClick={() => handleDelete(rule.id)}
                   className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Minimum Cart Value</p>
                <p className="text-2xl font-bold text-navy">Rs. {Number(rule.min_amount).toLocaleString()}</p>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-xs text-gray-500 italic">
                  * Customers spending more than this will get {rule.discount_percent}% off automatically.
                </p>
              </div>
            </div>
            
            {rule.is_active && (
              <div className="absolute top-0 right-0 p-1">
                 <div className="bg-gold text-navy text-[8px] font-black uppercase px-2 py-0.5 rounded-bl-lg">Active</div>
              </div>
            )}
          </div>
        ))}
        {rules.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100 text-gray-400">
            No discount tiers defined. Click "Add Tier" to create one.
          </div>
        )}
      </div>

      {/* Add Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <form onSubmit={handleAdd} className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">Create Discount Tier</h2>
              <Percent className="text-gold" size={24} />
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Minimum Shopping Amount (Rs.)</label>
                <input 
                  type="number" 
                  name="min_amount" 
                  required 
                  placeholder="e.g. 10000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/5 transition-all text-xl font-bold text-navy" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Discount Percentage (%)</label>
                <input 
                  type="number" 
                  name="discount_percent" 
                  required 
                  max="100"
                  placeholder="e.g. 15"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/5 transition-all text-xl font-bold text-gold" 
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-2 text-gray-500 font-bold hover:text-navy"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-2 bg-navy text-white font-bold rounded-lg hover:bg-navy/90 shadow-lg active:scale-95 transition-all"
              >
                Create Rule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
