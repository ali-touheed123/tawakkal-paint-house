'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layers,
  Image as ImageIcon,
  AlertTriangle,
  ChevronRight,
  X,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categoryBrands, setCategoryBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [managingSubsFor, setManagingSubsFor] = useState<any>(null);
  const [managingBrandsFor, setManagingBrandsFor] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [imgError, setImgError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchBrands();
    fetchCategoryBrands();
  }, []);

  async function fetchBrands() {
    const supabase = createClient();
    const { data } = await supabase.from('brands').select('*').eq('is_active', true).order('name');
    if (data) setBrands(data);
  }

  async function fetchCategoryBrands() {
    const supabase = createClient();
    const { data } = await supabase.from('category_brands').select('*');
    if (data) setCategoryBrands(data);
  }

  async function fetchCategories() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (data) setCategories(data);
    setLoading(false);
  }

  async function fetchSubCategories() {
    const supabase = createClient();
    const { data } = await supabase
      .from('sub_categories')
      .select('*')
      .order('name');
    if (data) setSubCategories(data);
  }

  useEffect(() => {
    if (isModalOpen) {
      setCurrentImageUrl(editingCategory?.image_url || '');
      setImgError(false);
    }
  }, [isModalOpen, editingCategory]);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure? This will not delete products in this category, but they may become orphaned.')) return;
    
    const supabase = createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    
    if (error) {
      alert('Failed to delete: ' + error.message);
      return;
    }

    setCategories(categories.filter(c => c.id !== id));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const categoryData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
      is_active: formData.get('is_active') === 'on'
    };

    const supabase = createClient();
    if (editingCategory?.id) {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', editingCategory.id);
      
      if (error) {
        alert('Failed to save: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('categories')
        .insert([categoryData]);
      
      if (error) {
        alert('Failed to create: ' + error.message);
        return;
      }
    }
    
    fetchCategories();
    setIsModalOpen(false);
    setEditingCategory(null);
  }

  async function handleSaveSub(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const subData = {
      category_id: managingSubsFor.id,
      name: formData.get('name'),
      slug: formData.get('slug'),
      is_active: formData.get('is_active') === 'on'
    };

    const supabase = createClient();
    if (editingSub?.id) {
      const { error } = await supabase
        .from('sub_categories')
        .update(subData)
        .eq('id', editingSub.id);
      
      if (error) {
        alert('Failed to save: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('sub_categories')
        .insert([subData]);
      
      if (error) {
        alert('Failed to create: ' + error.message);
        return;
      }
    }
    
    fetchSubCategories();
    setIsSubModalOpen(false);
    setEditingSub(null);
  }

  async function handleDeleteSub(id: string) {
    if (!confirm('Are you sure?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('sub_categories').delete().eq('id', id);
    if (error) {
      alert('Failed: ' + error.message);
      return;
    }
    fetchSubCategories();
  }

  async function toggleBrandAssociation(brandId: string) {
    if (!managingBrandsFor) return;
    const supabase = createClient();
    const existing = categoryBrands.find(cb => cb.category_id === managingBrandsFor.id && cb.brand_id === brandId);

    if (existing) {
      const { error } = await supabase
        .from('category_brands')
        .delete()
        .eq('category_id', managingBrandsFor.id)
        .eq('brand_id', brandId);
      if (error) alert('Failed to remove brand: ' + error.message);
    } else {
      const { error } = await supabase
        .from('category_brands')
        .insert([{ category_id: managingBrandsFor.id, brand_id: brandId }]);
      if (error) alert('Failed to add brand: ' + error.message);
    }
    fetchCategoryBrands();
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Categories</h1>
          <p className="text-gray-500">Manage product categories, hero displays, and sub-categories.</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
          className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search categories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="aspect-[16/9] relative overflow-hidden bg-gray-100">
              {category.image_url ? (
                <img src={category.image_url} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className={cn(
                   "px-2 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm",
                   category.is_active ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                )}>
                  {category.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-navy">{category.name}</h3>
                  <code className="text-[10px] bg-gray-50 px-1.5 py-0.5 rounded text-gray-400">{category.slug}</code>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => { setEditingCategory(category); setIsModalOpen(true); }}
                    className="p-2 text-gray-400 hover:text-navy hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-1.5 min-h-[50px]">
                {subCategories.filter(s => s.category_id === category.id).map(sub => (
                  <span key={sub.id} className="text-[10px] bg-navy/5 text-navy/60 px-2 py-1 rounded-full border border-navy/10">
                    {sub.name}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setManagingSubsFor(category)}
                  className="py-2 border-2 border-navy/10 hover:border-gold hover:bg-gold/5 text-navy text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Layers size={14} /> Subs
                </button>
                <button 
                  onClick={() => setManagingBrandsFor(category)}
                  className="py-2 border-2 border-navy/10 hover:border-gold hover:bg-gold/5 text-navy text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Target size={14} /> Brands
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Name</label>
                  <input 
                    name="name" 
                    defaultValue={editingCategory?.name} 
                    required 
                    onChange={(e) => {
                      if (!editingCategory) {
                        const slugInput = (e.target.form as HTMLFormElement).elements.namedItem('slug') as HTMLInputElement;
                        if (slugInput) slugInput.value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      }
                    }}
                    className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Slug</label>
                  <input name="slug" defaultValue={editingCategory?.slug} required className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Description</label>
                <textarea name="description" defaultValue={editingCategory?.description} rows={3} className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none resize-none text-sm" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Hero Image URL</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input 
                      name="image_url" 
                      value={currentImageUrl}
                      onChange={(e) => {
                        setCurrentImageUrl(e.target.value);
                        setImgError(false);
                      }}
                      placeholder="/images/categories/example.jpg" 
                      className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" 
                    />
                    <p className="text-[9px] text-gray-400 mt-1 italic">
                      Recommended: 1920x600px image for hero sections.
                    </p>
                  </div>
                  <div className="w-20 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                    {currentImageUrl && !imgError ? (
                      <img 
                        src={currentImageUrl} 
                        alt="Preview" 
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <ImageIcon size={20} className="text-gray-300" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <input type="checkbox" name="is_active" id="is_active" defaultChecked={editingCategory ? editingCategory.is_active : true} className="w-4 h-4 accent-gold" />
                 <label htmlFor="is_active" className="text-xs font-bold text-navy">Category is Active</label>
              </div>
            </div>

            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => { setIsModalOpen(false); setEditingCategory(null); }} className="px-5 py-2 text-sm text-gray-500 font-bold hover:text-navy">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-navy text-white text-sm font-bold rounded-lg hover:bg-navy/90 shadow-md transition-all active:scale-95">Save Category</button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-category Management Side Overlay */}
      {managingSubsFor && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy">Manage Sub-categories</h2>
                <p className="text-xs text-gray-400 mt-1">For {managingSubsFor.name}</p>
              </div>
              <button onClick={() => setManagingSubsFor(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <button 
                onClick={() => { setEditingSub(null); setIsSubModalOpen(true); }}
                className="w-full py-3 border-2 border-dashed border-gold/30 rounded-xl text-gold hover:bg-gold/5 flex items-center justify-center gap-2 font-bold text-sm transition-all"
              >
                <Plus size={18} /> Add New Sub-category
              </button>

              <div className="space-y-2">
                {subCategories.filter(s => s.category_id === managingSubsFor.id).map(sub => (
                  <div key={sub.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-navy text-sm">{sub.name}</h4>
                      <code className="text-[10px] text-gray-400">{sub.slug}</code>
                    </div>
                    <div className="flex gap-1">
                      <button 
                         onClick={() => { setEditingSub(sub); setIsSubModalOpen(true); }}
                         className="p-1.5 text-gray-400 hover:text-navy hover:bg-white rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSub(sub.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {subCategories.filter(s => s.category_id === managingSubsFor.id).length === 0 && (
                  <div className="text-center py-10 opacity-30">
                    <Layers size={48} className="mx-auto mb-2" />
                    <p className="text-sm">No sub-categories yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-category Add/Edit Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
          <form onSubmit={handleSaveSub} className="bg-white rounded-2xl w-full max-sm shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden border border-gold/20">
            <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-navy text-sm">
              {editingSub ? 'Edit Sub-category' : 'Add Sub-category'}
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Name</label>
                <input 
                  name="name" 
                  defaultValue={editingSub?.name} 
                  required 
                  onChange={(e) => {
                    if (!editingSub) {
                      const slugInput = (e.target.form as HTMLFormElement).elements.namedItem('slug') as HTMLInputElement;
                      if (slugInput) slugInput.value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    }
                  }}
                  className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Slug</label>
                <input name="slug" defaultValue={editingSub?.slug} required className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
              </div>
              <div className="flex items-center gap-2">
                 <input type="checkbox" name="is_active" id="is_sub_active" defaultChecked={editingSub ? editingSub.is_active : true} className="w-4 h-4 accent-gold" />
                 <label htmlFor="is_sub_active" className="text-xs font-bold text-navy">Active</label>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button type="button" onClick={() => { setIsSubModalOpen(false); setEditingSub(null); }} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-navy">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy/90 active:scale-95 transition-all">Save</button>
            </div>
          </form>
        </div>
      )}
      {/* Brand Management Side Overlay */}
      {managingBrandsFor && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy">Manage Brands</h2>
                <p className="text-xs text-gray-400 mt-1">For {managingBrandsFor.name}</p>
              </div>
              <button onClick={() => setManagingBrandsFor(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {brands.map(brand => {
                  const isAssociated = categoryBrands.some(cb => cb.category_id === managingBrandsFor.id && cb.brand_id === brand.id);
                  return (
                    <button 
                      key={brand.id}
                      onClick={() => toggleBrandAssociation(brand.id)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group",
                        isAssociated 
                          ? "border-gold bg-gold/5 text-navy" 
                          : "border-gray-100 hover:border-gold/30 text-gray-400"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded flex items-center justify-center overflow-hidden border",
                          isAssociated ? "bg-white border-gold/20" : "bg-gray-50 border-gray-200"
                        )}>
                          {brand.logo_url ? (
                            <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-[10px] font-bold">{brand.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-bold text-sm">{brand.name}</span>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        isAssociated ? "bg-gold border-gold scale-110" : "border-gray-200 group-hover:border-gold/50"
                      )}>
                        {isAssociated && <X size={12} className="text-navy rotate-45" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <p className="text-[10px] text-center text-gray-400">
                Brands selected here will appear in the navigation dropdown specifically for the <span className="text-navy font-bold">{managingBrandsFor.name}</span> category.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
