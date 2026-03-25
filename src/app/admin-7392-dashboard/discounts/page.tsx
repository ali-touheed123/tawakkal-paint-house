'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Percent, 
  Plus, 
  Edit2,
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Info,
  Wrench,
  Sparkles,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabourCheckoutTier } from '@/types';

export default function DiscountsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'service'>('general');
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Labour/Service Config State
  const [labourTiers, setLabourTiers] = useState<LabourCheckoutTier[]>([]);
  const [defaultWithoutDiscount, setDefaultWithoutDiscount] = useState<number>(10);
  const [upsellItems, setUpsellItems] = useState<string>(''); // comma-separated IDs
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchRules();
    fetchServiceSettings();
  }, []);

  async function fetchServiceSettings() {
    const supabase = createClient();
    const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['labour_checkout_tiers', 'labour_without_default_discount', 'labour_upsell_items']);

    if (data) {
        data.forEach((row: any) => {
            if (row.key === 'labour_checkout_tiers') setLabourTiers(row.value || []);
            if (row.key === 'labour_without_default_discount') setDefaultWithoutDiscount(Number(row.value) || 10);
            if (row.key === 'labour_upsell_items') setUpsellItems((row.value || []).join(',\n'));
        });
    }
  }

  async function saveServiceSettings() {
    setSavingSettings(true);
    const supabase = createClient();
    
    // Sort tiers by min_amount asc
    const sortedTiers = [...labourTiers].sort((a, b) => a.min_amount - b.min_amount);
    
    // Parse upsell IDs
    const parsedUpsell = upsellItems.split(',')
      .map(id => id.trim())
      .filter(id => id.length === 36); // basic UUID check

    await Promise.all([
      supabase.from('site_settings').upsert({ key: 'labour_checkout_tiers', value: sortedTiers }),
      supabase.from('site_settings').upsert({ key: 'labour_without_default_discount', value: defaultWithoutDiscount }),
      supabase.from('site_settings').upsert({ key: 'labour_upsell_items', value: parsedUpsell })
    ]);

    setSavingSettings(false);
    alert('Service settings saved successfully!');
  }

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
    
    if (error) {
      console.error('Error toggling discount status:', error);
      alert('Failed to update status: ' + error.message);
      return;
    }

    setRules(rules.map(r => r.id === id ? { ...r, is_active: !current } : r));
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this discount rule?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('discount_rules').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting discount rule:', error);
      alert('Failed to delete: ' + error.message);
      return;
    }

    setRules(rules.filter(r => r.id !== id));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const ruleData: any = {
      name: formData.get('name'),
      min_amount: Number(formData.get('min_amount')),
      discount_percent: Number(formData.get('discount_percent')),
    };

    // Only set default active for new rules
    if (!editingRule) {
      ruleData.is_active = true;
    }

    const supabase = createClient();
    if (editingRule?.id) {
      const { error } = await supabase
        .from('discount_rules')
        .update(ruleData)
        .eq('id', editingRule.id);
      
      if (error) {
        console.error('Error updating discount rule:', error);
        alert('Failed to save changes: ' + error.message);
        return;
      }
      fetchRules();
    } else {
      const { error } = await supabase
        .from('discount_rules')
        .insert([ruleData]);
      
      if (error) {
        console.error('Error creating discount rule:', error);
        alert('Failed to create rule: ' + error.message);
        return;
      }
      fetchRules();
    }
    
    setIsModalOpen(false);
    setEditingRule(null);
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setEditingRule(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Discounts & Services</h1>
          <p className="text-gray-500">Manage checkout discounts and labour service configurations.</p>
        </div>
        {activeTab === 'general' && (
          <button 
            onClick={() => { setEditingRule(null); setIsModalOpen(true); }}
            className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} /> Add General Tier
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('general')}
          className={cn(
            "pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors",
            activeTab === 'general' ? "border-navy text-navy" : "border-transparent text-gray-400 hover:text-navy"
          )}
        >
          General Checkout Discounts
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={cn(
            "pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors",
            activeTab === 'service' ? "border-navy text-navy" : "border-transparent text-gray-400 hover:text-navy"
          )}
        >
          Labour Service Configuration
        </button>
      </div>

      {activeTab === 'general' ? (
        <div className="space-y-6 animate-in fade-in duration-300">
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
                      onClick={() => { setEditingRule(rule); setIsModalOpen(true); }}
                      className="p-2 text-gray-300 hover:text-navy transition-colors"
                    >
                      <Edit2 size={20} />
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
                    <p className="text-[10px] font-black text-gold uppercase tracking-widest mb-1">{rule.name || 'Discount Tier'}</p>
                    <p className="text-2xl font-bold text-navy">Rs. {Number(rule.min_amount).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Min. Shopping Amount</p>
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
                No discount tiers defined. Click "Add General Tier" to create one.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
          
          {/* Global Defaults */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Wrench size={20} className="text-amber-500" />
              Global Settings
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">
                  Default "Without-Labour" Discount %
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={defaultWithoutDiscount}
                    onChange={(e) => setDefaultWithoutDiscount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/5 transition-all font-bold text-navy" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  Applied to items selected "Without Labour" if the product doesn't have a specific override.
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Tiers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                  <Percent size={20} className="text-green-500" />
                  Service Discount Tiers (Checkout)
                </h2>
                <p className="text-xs text-gray-500 mt-1">Applied ONLY to the "With-Labour" subtotal sub-portion of the cart.</p>
              </div>
              <button 
                onClick={() => setLabourTiers([...labourTiers, { min_amount: 0, discount_type: 'percent', discount_value: 0, label: 'New Tier' }])}
                className="text-sm font-bold text-gold hover:text-gold-dark flex items-center gap-1 px-4 py-2 bg-gold/5 rounded-lg transition-colors"
              >
                <Plus size={16} /> Add Tier
              </button>
            </div>
            
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="pb-3 w-[25%]">Min Amount (Rs)</th>
                    <th className="pb-3 w-[25%]">Discount Type</th>
                    <th className="pb-3 w-[20%]">Value</th>
                    <th className="pb-3 w-[25%]">Customer Label</th>
                    <th className="pb-3 w-[5%] text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {labourTiers.map((tier, idx) => (
                    <tr key={idx}>
                      <td className="py-3 pr-4">
                        <input 
                          type="number" 
                          value={tier.min_amount}
                          onChange={(e) => {
                            const newTiers = [...labourTiers];
                            newTiers[idx].min_amount = Number(e.target.value);
                            setLabourTiers(newTiers);
                          }}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm font-bold focus:border-gold focus:outline-none" 
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <select
                          value={tier.discount_type}
                          onChange={(e) => {
                            const newTiers = [...labourTiers];
                            newTiers[idx].discount_type = e.target.value as 'flat' | 'percent';
                            setLabourTiers(newTiers);
                          }}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm font-bold focus:border-gold focus:outline-none"
                        >
                          <option value="percent">Percentage (%)</option>
                          <option value="flat">Flat Amount (Rs)</option>
                        </select>
                      </td>
                      <td className="py-3 pr-4">
                        <input 
                          type="number" 
                          value={tier.discount_value}
                          onChange={(e) => {
                            const newTiers = [...labourTiers];
                            newTiers[idx].discount_value = Number(e.target.value);
                            setLabourTiers(newTiers);
                          }}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm font-bold text-gold focus:border-gold focus:outline-none" 
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <input 
                          type="text" 
                          value={tier.label}
                          onChange={(e) => {
                            const newTiers = [...labourTiers];
                            newTiers[idx].label = e.target.value;
                            setLabourTiers(newTiers);
                          }}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm focus:border-gold focus:outline-none" 
                        />
                      </td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => setLabourTiers(labourTiers.filter((_, i) => i !== idx))}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {labourTiers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-gray-400">No service discount tiers configured.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upsell Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-gold" />
              Product Page Upsell Items
            </h2>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">
                Product IDs (Comma Separated)
              </label>
              <textarea 
                value={upsellItems}
                onChange={(e) => setUpsellItems(e.target.value)}
                rows={4}
                placeholder="00000000-0000-0000-0000-000000000000,&#10;11111111-1111-1111-1111-111111111111"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/5 transition-all font-mono text-sm leading-relaxed" 
              />
              <p className="text-[10px] text-gray-400 mt-2">
                Paste the database IDs of the products you want to feature in the "Recommended Tools" section when a user selects "Without Labour". Items appear in the order specified. Max 4 shown.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={saveServiceSettings}
              disabled={savingSettings}
              className="px-8 py-3 bg-navy text-white font-bold rounded-lg hover:bg-navy/90 shadow-lg active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

        </div>
      )}

      {/* Add/Edit Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">{editingRule ? 'Edit Discount Tier' : 'Create Discount Tier'}</h2>
              <Percent className="text-gold" size={24} />
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Discount Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  defaultValue={editingRule?.name}
                  placeholder="e.g. Ramadan Sale"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/5 transition-all text-lg font-bold text-navy" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Minimum Shopping Amount (Rs.)</label>
                <input 
                  type="number" 
                  name="min_amount" 
                  required 
                  defaultValue={editingRule?.min_amount}
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
                  defaultValue={editingRule?.discount_percent}
                  placeholder="e.g. 15"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/5 transition-all text-xl font-bold text-gold" 
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => { setIsModalOpen(false); setEditingRule(null); }} 
                className="px-6 py-2 text-gray-500 font-bold hover:text-navy"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-2 bg-navy text-white font-bold rounded-lg hover:bg-navy/90 shadow-lg active:scale-95 transition-all"
              >
                {editingRule ? 'Save Changes' : 'Create Rule'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
