'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Loader2, Briefcase, Plus, Trash2, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PACKAGE_IDS = ['local', 'normal', 'best', 'premium'];

const DEFAULT_PACKAGES_CONFIG = [
  {
    id: 'local',
    name: 'Local Quality',
    description: 'Budget-friendly standard painting',
    includes: ['Emulsion', 'Oil Paint'],
  },
  {
    id: 'normal',
    name: 'Normal Quality',
    description: 'Durable quality for everyday living',
    includes: ['Emulsion', 'Oil Paint'],
  },
  {
    id: 'best',
    name: 'Best Quality',
    description: 'Premium protection and finish',
    includes: ['Weather', 'Emulsion', 'Oil Paint'],
  },
  {
    id: 'premium',
    name: 'Premium Quality',
    description: 'The ultimate luxury paint experience',
    includes: ['Filling', 'Matt', 'Weather', 'Emulsion', 'Oil Paint'],
  }
];

export default function DealsManagement() {
  const [pricing, setPricing] = useState<Record<string, number>>({
    local: 0,
    normal: 0,
    best: 0,
    premium: 0
  });
  const [labourDiscount, setLabourDiscount] = useState<number>(25);
  const [visitFee, setVisitFee] = useState<number>(1000);
  const [packagesConfig, setPackagesConfig] = useState(DEFAULT_PACKAGES_CONFIG);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function fetchPricing() {
      const supabase = createClient();
      
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      const { data: pricingData } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'deals_base_pricing')
        .single();

      const { data: configData } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['deals_labour_discount', 'deals_visit_fee', 'deals_packages_config']);

      if (pricingData && pricingData.value) {
        setPricing(pricingData.value);
      }
      
      if (configData) {
        configData.forEach(item => {
          if (item.key === 'deals_labour_discount') setLabourDiscount(item.value);
          if (item.key === 'deals_visit_fee') setVisitFee(item.value);
          if (item.key === 'deals_packages_config') setPackagesConfig(item.value);
        });
      }
      
      setLoading(false);
    }
    fetchPricing();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();

    try {
      const updates = [
        { key: 'deals_base_pricing', value: pricing },
        { key: 'deals_labour_discount', value: labourDiscount },
        { key: 'deals_visit_fee', value: visitFee },
        { key: 'deals_packages_config', value: packagesConfig }
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(
          updates.map(u => ({ ...u, updated_at: new Date().toISOString() })),
          { onConflict: 'key' }
        );

      if (error) throw error;
      setMessage({ type: 'success', text: 'All settings updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving deals settings:', error);
      setMessage({ type: 'error', text: `Failed to update settings: ${error.message || 'Unknown error'}` });
    } finally {
      setSaving(false);
    }
  };

  const addInclusion = (packageId: string) => {
    setPackagesConfig(prev => prev.map(pkg => {
      if (pkg.id === packageId) {
        return { ...pkg, includes: [...pkg.includes, ''] };
      }
      return pkg;
    }));
  };

  const updateInclusion = (packageId: string, index: number, value: string) => {
    setPackagesConfig(prev => prev.map(pkg => {
      if (pkg.id === packageId) {
        const newIncludes = [...pkg.includes];
        newIncludes[index] = value;
        return { ...pkg, includes: newIncludes };
      }
      return pkg;
    }));
  };

  const removeInclusion = (packageId: string, index: number) => {
    setPackagesConfig(prev => prev.map(pkg => {
      if (pkg.id === packageId) {
        const newIncludes = [...pkg.includes];
        newIncludes.splice(index, 1);
        return { ...pkg, includes: newIncludes };
      }
      return pkg;
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
            <Briefcase className="text-gold" />
            Deals Management
          </h1>
          <p className="text-sm text-gray-500 mt-2">Customize pricing, labor rates, and what&apos;s included in each package.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-navy text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-navy/90 transition-all disabled:opacity-50 shadow-lg shadow-navy/20 active:scale-95 w-full md:w-auto"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-semibold">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Config Card */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2">
            <Info className="text-gold" size={20} />
            Global Rates
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                Labor Discount % (When unchecked)
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={labourDiscount}
                  onChange={(e) => setLabourDiscount(Number(e.target.value))}
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all font-bold text-navy"
                  placeholder="e.g. 25"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                If the customer chooses &quot;Material Only&quot;, the price will be reduced by this percentage.
              </p>
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                Site Visit Fee
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs.</div>
                <input
                  type="number"
                  value={visitFee}
                  onChange={(e) => setVisitFee(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all font-bold text-navy"
                  placeholder="e.g. 1000"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Flat fee added to the total when &quot;Site Visit &amp; Measurement&quot; is selected.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gold/5 border border-gold/10 p-8 rounded-2xl flex flex-col justify-center">
            <h3 className="font-bold text-navy mb-3">Live Integration</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Updating these values immediately changes how the calculator functions on the website. 
              The <strong>Labor Discount</strong> ensures you get paid fairly for material supply even if your team doesn&apos;t do the work.
            </p>
        </div>
      </div>

      {/* Packages Configuration Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-navy">Package Specifics</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {packagesConfig.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-inner">
                        {pkg.id.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <input 
                            type="text"
                            value={pkg.name}
                            onChange={(e) => setPackagesConfig(prev => prev.map(p => p.id === pkg.id ? { ...p, name: e.target.value } : p))}
                            className="font-bold text-lg text-navy bg-transparent border-none p-0 focus:ring-0 outline-none w-full sm:w-fit"
                        />
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Package Tier</div>
                    </div>
                </div>
                
                <div className="sm:text-right bg-white/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-gray-100 sm:border-none">
                    <div className="flex items-center sm:justify-end gap-1 text-navy font-bold mb-1">
                        <span className="text-xs text-gray-400 font-medium">Current Base:</span>
                        <span className="text-gold">Rs. {pricing[pkg.id]?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Update:</span>
                      <input 
                          type="number"
                          value={pricing[pkg.id] || 0}
                          onChange={(e) => setPricing(prev => ({ ...prev, [pkg.id]: Number(e.target.value) }))}
                          className="text-sm font-bold border border-gray-200 rounded-lg px-2 py-1.5 w-28 outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                      />
                    </div>
                </div>
              </div>

              <div className="p-8 space-y-6 flex-1">
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Description</label>
                    <textarea 
                        value={pkg.description}
                        onChange={(e) => setPackagesConfig(prev => prev.map(p => p.id === pkg.id ? { ...p, description: e.target.value } : p))}
                        className="w-full text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border-none focus:ring-1 focus:ring-gold outline-none resize-none h-20"
                    />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Inclusions</label>
                    <button 
                        onClick={() => addInclusion(pkg.id)}
                        className="text-[10px] font-bold text-gold hover:text-gold-dark flex items-center gap-1 uppercase tracking-tighter"
                    >
                        <Plus size={10} /> Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {pkg.includes.map((item, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={index} 
                        className="flex items-center gap-2 group"
                      >
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateInclusion(pkg.id, index, e.target.value)}
                          className="flex-1 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                          placeholder="e.g. Premium Finish"
                        />
                        <button
                          onClick={() => removeInclusion(pkg.id, index)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                    {pkg.includes.length === 0 && (
                        <div className="text-center py-4 text-xs text-gray-400 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            No inclusions added. Click &quot;Add Item&quot; to start.
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
