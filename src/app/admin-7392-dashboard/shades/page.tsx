'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Palette,
  X as CloseIcon,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function ShadesPage() {
  const [shades, setShades] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingShade, setEditingShade] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrumAvailable, setIsDrumAvailable] = useState(false);
  
  // Pagination state (since there are 3000+ shades)
  const [page, setPage] = useState(0);
  const itemsPerPage = 50;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchShades();
  }, [page, searchTerm]);

  async function fetchProducts() {
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('id, name, brand')
      .order('name', { ascending: true });
    
    if (data) setProducts(data);
  }

  async function fetchShades() {
    setLoading(true);
    const supabase = createClient();
    
    let query = supabase
      .from('product_shades')
      .select(`*, products(name, brand)`, { count: 'exact' });
      
    if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%`);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);
      
    if (error) {
        console.error("Error fetching shades:", error);
    } else {
        if (data) setShades(data);
        if (count !== null) setTotalCount(count);
    }
    
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this shade?')) return;
    
    const supabase = createClient();
    const { error } = await supabase.from('product_shades').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting shade:', error);
      alert('Failed to delete shade: ' + error.message);
      return;
    }

    fetchShades(); // Refresh current page
  }

  useEffect(() => {
    if (isModalOpen) {
      if (editingShade) {
          setIsDrumAvailable(editingShade.is_drum_available || false);
      } else {
          setIsDrumAvailable(false);
      }
    }
  }, [isModalOpen, editingShade]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const shadeData = {
      product_id: formData.get('product_id'),
      name: formData.get('name'),
      code: formData.get('code'),
      hex: formData.get('hex'),
      image_url: formData.get('image_url') || null,
      is_drum_available: isDrumAvailable
    };

    const supabase = createClient();
    
    if (editingShade?.id) {
      const { error } = await supabase
        .from('product_shades')
        .update(shadeData)
        .eq('id', editingShade.id);
      
      if (error) {
        console.error('Error updating shade:', error);
        alert('Failed to save shade: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('product_shades')
        .insert([shadeData]);
      
      if (error) {
        console.error('Error creating shade:', error);
        alert('Failed to create shade: ' + error.message);
        return;
      }
    }
    
    setIsModalOpen(false);
    setEditingShade(null);
    fetchShades();
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setEditingShade(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Shades Dashboard</h1>
          <p className="text-gray-500">Manage shade metadata and Hex color codes mapped to your products.</p>
        </div>
        <button 
          onClick={() => { setEditingShade(null); setIsModalOpen(true); }}
          className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Add Shade
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by shade name or code..." 
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0); // reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Preview</th>
                <th className="px-6 py-4">Shade Details</th>
                <th className="px-6 py-4">Linked Product</th>
                <th className="px-6 py-4">Drum Available?</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shades.map((shade) => (
                <tr key={shade.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-inner" style={{ backgroundColor: shade.hex || '#ffffff' }} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-navy">{shade.name}</div>
                    <div className="text-xs text-gray-400 font-mono tracking-widest">{shade.code}</div>
                    <div className="text-[10px] text-gray-400">{shade.hex}</div>
                  </td>
                  <td className="px-6 py-4">
                      {shade.products ? (
                          <>
                           <div className="text-sm font-bold text-navy">{shade.products.name}</div>
                           <div className="text-xs text-gray-400">{shade.products.brand}</div>
                          </>
                      ) : (
                          <span className="text-red-500 text-xs font-bold">Orphaned Shade</span>
                      )}
                  </td>
                  <td className="px-6 py-4">
                    {shade.is_drum_available ? (
                         <div className="flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle size={14}/> Yes</div>
                    ) : (
                         <div className="flex items-center gap-1 text-gray-400 text-xs font-bold"><XCircle size={14}/> No</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => { setEditingShade(shade); setIsModalOpen(true); }}
                         className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                       >
                         <Edit2 size={18} />
                       </button>
                       <button 
                         onClick={() => handleDelete(shade.id)}
                         className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100">
          {shades.map((shade) => (
            <div key={shade.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-inner shrink-0" style={{ backgroundColor: shade.hex || '#ffffff' }} />
                     <div>
                         <div className="font-bold text-navy">{shade.name}</div>
                         <div className="text-xs text-gray-400 font-mono tracking-widest">{shade.code}</div>
                     </div>
                 </div>
                 <div className="flex flex-col gap-1">
                   <button 
                      onClick={() => { setEditingShade(shade); setIsModalOpen(true); }}
                      className="p-2 bg-gray-100 text-navy rounded-lg hover:bg-gold hover:text-navy transition-all"
                   >
                     <Edit2 size={14} />
                   </button>
                   <button 
                      onClick={() => handleDelete(shade.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                   >
                     <Trash2 size={14} />
                   </button>
                 </div>
              </div>
              <div className="bg-gray-50 rounded p-2 text-xs text-gray-600 border border-gray-100 mt-2">
                  <span className="font-bold">Product:</span> {shade.products?.name || 'Unknown'} ({shade.products?.brand || 'Unknown'})
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="p-12 text-center text-gray-400 bg-gray-50 flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-gold border-t-transparent animate-spin"/>
            Loading shades...
          </div>
        )}

        {!loading && shades.length === 0 && (
          <div className="p-12 text-center text-gray-400 bg-gray-50">
            No shades found. Add a new shade to get started.
          </div>
        )}
      </div>

       {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
             <div className="text-xs text-gray-500 font-medium">
                 Showing {page * itemsPerPage + 1} to {Math.min((page + 1) * itemsPerPage, totalCount)} of {totalCount} shades
             </div>
             <div className="flex gap-2">
                 <button 
                     onClick={() => setPage(Math.max(0, page - 1))}
                     disabled={page === 0}
                     className="px-4 py-2 text-sm font-bold rounded-lg border border-gray-200 disabled:opacity-50 disabled:bg-gray-50 text-navy hover:bg-gray-50 transition-colors"
                  >
                     Previous
                 </button>
                 <button 
                     onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                     disabled={page >= totalPages - 1}
                     className="px-4 py-2 text-sm font-bold rounded-lg border border-gray-200 disabled:opacity-50 disabled:bg-gray-50 text-navy hover:bg-gray-50 transition-colors"
                  >
                     Next
                 </button>
             </div>
        </div>
      )}

      {/* Shade Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy/60 backdrop-blur-sm overflow-hidden">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                  <Palette size={20} className="text-gold" />
                  {editingShade ? 'Edit Shade Details' : 'Add New Shade'}
              </h2>
            </div>
            
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Linked Product</label>
                <select 
                  name="product_id" 
                  defaultValue={editingShade?.product_id || ''} 
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm font-medium"
                >
                  <option value="" disabled>Select a Product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Shade Name</label>
                    <input name="name" defaultValue={editingShade?.name} required placeholder="e.g. Off White" className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Shade Code</label>
                    <input name="code" defaultValue={editingShade?.code} required placeholder="e.g. 505" className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm font-mono" />
                  </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Hex Color</label>
                <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      name="hex_picker"
                      defaultValue={editingShade?.hex || '#ffffff'}
                      onChange={(e) => {
                          const input = document.getElementById('hex_input') as HTMLInputElement;
                          if (input) input.value = e.target.value.toUpperCase();
                      }}
                      className="w-12 h-12 p-1 bg-white border border-gray-200 rounded-lg cursor-pointer"
                    />
                    <input 
                      id="hex_input"
                      name="hex" 
                      defaultValue={editingShade?.hex || '#FFFFFF'} 
                      required 
                      placeholder="#FFFFFF" 
                      className="flex-1 p-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm font-mono tracking-widest" 
                    />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Image URL (Optional Preview Image)</label>
                <input name="image_url" defaultValue={editingShade?.image_url} placeholder="/images/shades/offwhite.jpg" className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <input 
                    type="checkbox" 
                    checked={isDrumAvailable} 
                    onChange={(e) => setIsDrumAvailable(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-navy focus:ring-navy" 
                   />
                  <div>
                    <span className="text-sm font-bold text-navy group-hover:text-gold transition-colors block">Available in Drum Size?</span>
                  </div>
                </label>
              </div>

            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                type="button" 
                onClick={() => { setIsModalOpen(false); setEditingShade(null); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-[2] py-3 bg-navy text-white rounded-xl font-bold text-sm hover:bg-gold transition-all shadow-lg shadow-navy/20"
              >
                {editingShade ? 'Save Changes' : 'Add Shade'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
