'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  X,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [currentLogoUrl, setCurrentLogoUrl] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true });
    
    if (data) setBrands(data);
    setLoading(false);
  }

  useEffect(() => {
    if (isModalOpen) {
      setCurrentLogoUrl(editingBrand?.logo_url || '');
      setImgError(false);
    }
  }, [isModalOpen, editingBrand]);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure? This will remove the brand from all categories but will NOT delete products assigned to this brand.')) return;
    
    const supabase = createClient();
    const { error } = await supabase.from('brands').delete().eq('id', id);
    
    if (error) {
      alert('Failed to delete: ' + error.message);
      return;
    }

    setBrands(brands.filter(b => b.id !== id));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const brandData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      logo_url: formData.get('logo_url'),
      is_active: formData.get('is_active') === 'on'
    };

    const supabase = createClient();
    if (editingBrand?.id) {
      const { error } = await supabase
        .from('brands')
        .update(brandData)
        .eq('id', editingBrand.id);
      
      if (error) {
        alert('Failed to save: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('brands')
        .insert([brandData]);
      
      if (error) {
        alert('Failed to create: ' + error.message);
        return;
      }
    }
    
    fetchBrands();
    setIsModalOpen(false);
    setEditingBrand(null);
  }

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Brands</h1>
          <p className="text-gray-500">Manage all product brands and their logos.</p>
        </div>
        <button 
          onClick={() => { setEditingBrand(null); setIsModalOpen(true); }}
          className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Add Brand
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search brands..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBrands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="aspect-video relative bg-gray-50 flex items-center justify-center p-6 border-b border-gray-50">
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center text-navy/20 font-bold text-2xl">
                  {brand.name.charAt(0)}
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-1">
                 <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm",
                    brand.is_active ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                 )}>
                   {brand.is_active ? 'Active' : 'Hidden'}
                 </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-navy">{brand.name}</h3>
                  <code className="text-[10px] bg-gray-50 px-1.5 py-0.5 rounded text-gray-400">{brand.slug}</code>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => { setEditingBrand(brand); setIsModalOpen(true); }}
                    className="p-2 text-gray-400 hover:text-navy hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(brand.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-navy">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Name</label>
                  <input 
                    name="name" 
                    defaultValue={editingBrand?.name} 
                    required 
                    onChange={(e) => {
                      if (!editingBrand) {
                        const slugInput = (e.target.form as HTMLFormElement).elements.namedItem('slug') as HTMLInputElement;
                        if (slugInput) slugInput.value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      }
                    }}
                    className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Slug</label>
                  <input name="slug" defaultValue={editingBrand?.slug} required className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Logo URL</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input 
                      name="logo_url" 
                      value={currentLogoUrl}
                      onChange={(e) => {
                        setCurrentLogoUrl(e.target.value);
                        setImgError(false);
                      }}
                      placeholder="/images/brands/logo.png" 
                      className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" 
                    />
                  </div>
                  <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                    {currentLogoUrl && !imgError ? (
                      <img 
                        src={currentLogoUrl} 
                        alt="Preview" 
                        onError={() => setImgError(true)}
                        className="w-full h-full object-contain p-1" 
                      />
                    ) : (
                      <ImageIcon size={20} className="text-gray-300" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                 <input type="checkbox" name="is_active" id="is_active" defaultChecked={editingBrand ? editingBrand.is_active : true} className="w-4 h-4 accent-gold" />
                 <label htmlFor="is_active" className="text-xs font-bold text-navy">Brand is Active & Visible</label>
              </div>
            </div>

            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => { setIsModalOpen(false); setEditingBrand(null); }} className="px-5 py-2 text-sm text-gray-500 font-bold hover:text-navy">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-navy text-white text-sm font-bold rounded-lg hover:bg-navy/90 shadow-md transition-all active:scale-95">Save Brand</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
