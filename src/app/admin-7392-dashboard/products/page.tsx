'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package,
  AlertTriangle,
  X as CloseIcon,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUnits, setModalUnits] = useState<{ label: string; price: number }[]>([
    { label: 'Quarter', price: 0 },
    { label: 'Gallon', price: 0 },
    { label: 'Drum', price: 0 }
  ]);

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
   const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
  }, []);

  async function fetchSubCategories() {
    const supabase = createClient();
    const { data } = await supabase.from('sub_categories').select('*').eq('is_active', true);
    if (data) setSubCategories(data);
  }

  async function fetchCategories() {
    const supabase = createClient();
    const { data } = await supabase.from('categories').select('*').eq('is_active', true);
    if (data) setCategories(data);
  }

  async function fetchProducts() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (data) setProducts(data);
    setLoading(false);
  }


  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + error.message);
      return;
    }

    setProducts(products.filter(p => p.id !== id));
  }

  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setCurrentImageUrl(editingProduct?.image_url || '');
      setImgError(false);
      setSelectedCategorySlug(editingProduct?.category || categories[0]?.slug || '');
      
      if (editingProduct?.units && Array.isArray(editingProduct.units) && editingProduct.units.length > 0) {
        setModalUnits(editingProduct.units);
      } else {
        setModalUnits([
          { label: 'Quarter', price: 0 },
          { label: 'Gallon', price: 0 },
          { label: 'Drum', price: 0 }
        ]);
      }
    }
  }, [isModalOpen, editingProduct, categories]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const productData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      sub_category: formData.get('sub_category'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
      units: modalUnits.filter(u => u.label.trim() !== ''),
      in_stock: formData.get('in_stock') === 'on',
      shade_card_url: formData.get('shade_card_url')
    };

    const supabase = createClient();
    if (editingProduct?.id) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
      
      if (error) {
        console.error('Error updating product:', error);
        alert('Failed to save product: ' + error.message);
        return;
      }
      fetchProducts();
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);
      
      if (error) {
        console.error('Error creating product:', error);
        alert('Failed to create product: ' + error.message);
        return;
      }
      fetchProducts();
    }
    
    setIsModalOpen(false);
    setEditingProduct(null);
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setEditingProduct(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Products</h1>
          <p className="text-gray-500">Manage your inventory, prices, and availability.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Pricing & Units</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="text-gray-300" size={20} />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-navy">{product.name}</div>
                        <div className="text-xs text-gray-400">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">
                    <div className="flex flex-col gap-1">
                       {product.units && Array.isArray(product.units) && product.units.length > 0 ? (
                         product.units.map((unit: any, idx: number) => (
                           <div key={idx} className="flex justify-between gap-4 border-b border-gray-50 last:border-0 pb-1 last:pb-0">
                             <span className="text-[10px] text-gray-400 uppercase font-bold">{unit.label}</span>
                             <span className="text-navy font-bold">Rs. {unit.price}</span>
                           </div>
                         ))
                       ) : (
                         <span className="text-gray-400 italic text-xs">No pricing</span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                      product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
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

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="text-gray-300" size={24} />
                    )}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="font-bold text-navy truncate">{product.name}</div>
                    <div className="text-xs text-gray-400">{product.brand}</div>
                    <div className="mt-1">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                        product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                   <button 
                      onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                      className="p-2.5 bg-gray-100 text-navy rounded-lg hover:bg-gold hover:text-navy transition-all"
                   >
                     <Edit2 size={18} />
                   </button>
                   <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200/50">
                 {product.units && Array.isArray(product.units) && product.units.slice(0, 4).map((unit: any, idx: number) => (
                   <div key={idx} className="text-center">
                      <div className="text-[9px] text-gray-400 uppercase font-bold truncate px-1">{unit.label}</div>
                      <div className="font-mono text-navy font-bold text-sm">Rs. {unit.price}</div>
                   </div>
                 ))}
                 {product.units && product.units.length > 4 && (
                   <div className="col-span-2 text-[9px] text-gray-400 text-center font-bold">
                     + {product.units.length - 4} more units
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-400 bg-gray-50">
            No products matches your search.
          </div>
        )}
      </div>

      {/* Product Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Product Name</label>
                <input name="name" defaultValue={editingProduct?.name} required className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Brand</label>
                <input name="brand" defaultValue={editingProduct?.brand} required className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Category</label>
                <select 
                  name="category" 
                  defaultValue={editingProduct?.category || categories[0]?.slug} 
                  onChange={(e) => {
                    setSelectedCategorySlug(e.target.value);
                    // Reset sub-category select value when category changes
                    const subCatSelect = (e.target.form as HTMLFormElement).elements.namedItem('sub_category') as HTMLSelectElement;
                    if (subCatSelect) subCatSelect.value = '';
                  }}
                  className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Sub-category</label>
                <select 
                  name="sub_category" 
                  defaultValue={editingProduct?.sub_category}
                  className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm"
                >
                  <option value="">None</option>
                  {subCategories
                    .filter(s => {
                      const cat = categories.find(c => c.slug === selectedCategorySlug);
                      return s.category_id === cat?.id;
                    })
                    .map(sub => (
                      <option key={sub.id} value={sub.slug}>{sub.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Image URL</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input 
                      name="image_url" 
                      value={currentImageUrl}
                      onChange={(e) => {
                        setCurrentImageUrl(e.target.value);
                        setImgError(false);
                      }}
                      placeholder="/images/products/brand/name.png" 
                      className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" 
                    />
                    <p className="text-[9px] text-gray-400 mt-1 italic">
                      Filenames are case-sensitive. Path should start with /images/products/
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                    {currentImageUrl && !imgError ? (
                      <img 
                        src={currentImageUrl} 
                        alt="Preview" 
                        onError={() => setImgError(true)}
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[8px] text-gray-300 gap-1">
                        <Package size={16} />
                        <span>No Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Description</label>
                <textarea name="description" defaultValue={editingProduct?.description} rows={2} className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none resize-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Shade Card PDF URL</label>
                <input 
                  name="shade_card_url" 
                  defaultValue={editingProduct?.shade_card_url} 
                  placeholder="https://example.com/shade-card.pdf" 
                  className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold focus:outline-none text-sm" 
                />
              </div>
              <div className="col-span-2 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pricing & Units</label>
                  <button 
                    type="button" 
                    onClick={() => setModalUnits([...modalUnits, { label: '', price: 0 }])}
                    className="text-gold hover:text-gold-dark text-xs font-bold flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Unit
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {modalUnits.map((unit, idx) => (
                    <div key={idx} className="flex gap-2 items-end bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                      <div className="flex-1">
                        <label className="block text-[8px] text-gray-400 mb-0.5 uppercase">Label</label>
                        <input 
                          value={unit.label} 
                          onChange={(e) => {
                            const newUnits = [...modalUnits];
                            newUnits[idx].label = e.target.value;
                            setModalUnits(newUnits);
                          }}
                          placeholder="e.g. 1 inch" 
                          className="w-full p-1.5 bg-white border border-gray-100 rounded focus:border-gold focus:outline-none text-xs" 
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-[8px] text-gray-400 mb-0.5 uppercase">Price</label>
                        <input 
                          type="number" 
                          value={unit.price} 
                          onChange={(e) => {
                            const newUnits = [...modalUnits];
                            newUnits[idx].price = Number(e.target.value);
                            setModalUnits(newUnits);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="w-full p-1.5 bg-white border border-gray-100 rounded focus:border-gold focus:outline-none text-xs font-bold" 
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setModalUnits(modalUnits.filter((_, i) => i !== idx))}
                        className="p-2 text-gray-400 hover:text-red-500"
                        disabled={modalUnits.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <input type="checkbox" name="in_stock" id="in_stock" defaultChecked={editingProduct ? editingProduct.in_stock : true} className="w-4 h-4 accent-gold" />
                 <label htmlFor="in_stock" className="text-xs font-bold text-navy">In Stock</label>
              </div>
            </div>
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => { setIsModalOpen(false); setEditingProduct(null); }} className="px-5 py-2 text-sm text-gray-500 font-bold hover:text-navy">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-navy text-white text-sm font-bold rounded-lg hover:bg-navy/90 shadow-md transition-all active:scale-95">Save Product</button>
            </div>
          </form>
        </div>
      )}


    </div>
  );
}

